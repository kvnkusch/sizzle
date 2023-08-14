import { initTRPC } from '@trpc/server';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { z } from 'zod';
import { todo, tag, tagToTodo, todoGroup } from '@sizzle/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import superjson from 'superjson';

export type TrpcContext = {
  db: NodePgDatabase;
};

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const trpcRouter = t.router({
  tags: t.procedure.query(({ ctx }) => {
    return ctx.db
      .select({
        id: tag.id,
        name: tag.name,
      })
      .from(tag);
  }),
  todos: t.procedure.query(({ input, ctx }) => {
    return ctx.db
      .select({
        id: todo.id,
        text: todo.text,
        isDone: todo.isDone,
      })
      .from(todo);
  }),
  todo: t.procedure
    .input(z.object({ todoId: z.string() }))
    .query(async ({ input, ctx }) => {
      const [todos, tags] = await Promise.all([
        ctx.db
          .select({
            id: todo.id,
            text: todo.text,
            isDone: todo.isDone,
            group: {
              id: todoGroup.id,
              name: todoGroup.name,
            },
          })
          .from(todo)
          .leftJoin(todoGroup, eq(todo.groupId, todoGroup.id))
          .where(eq(todo.id, input.todoId)),
        ctx.db
          .select({
            id: tag.id,
            name: tag.name,
          })
          .from(tag)
          .innerJoin(tagToTodo, eq(tag.id, tagToTodo.tagId))
          .where(eq(tagToTodo.todoId, input.todoId)),
      ]);
      const result = pickOne(todos);
      return {
        ...result,
        tags,
      };
    }),
  createTodo: t.procedure
    .input(
      z.object({
        text: z.string(),
        groupId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(todo)
        .values({
          groupId: input.groupId,
          text: input.text,
        })
        .returning({
          id: todo.id,
        });
      return {
        todoId: result[0]?.id,
      };
    }),
  deleteTodo: t.procedure
    .input(
      z.object({
        todoId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .delete(todo)
        .where(eq(todo.id, input.todoId))
        .returning({
          id: todo.id,
        });
      return {
        todoId: result[0]?.id,
      };
    }),
  editTodoIsDone: t.procedure
    .input(
      z.object({
        todoId: z.string(),
        isDone: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(todo)
        .set({
          isDone: input.isDone,
        })
        .where(eq(todo.id, input.todoId))
        .returning({
          id: todo.id,
        });
      return {
        todoId: result[0]?.id,
      };
    }),
  editTodoGroup: t.procedure
    .input(
      z.object({
        todoId: z.string(),
        groupId: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .update(todo)
        .set({
          groupId: input.groupId,
        })
        .where(eq(todo.id, input.todoId))
        .returning({
          id: todo.id,
        });
      return {
        todoId: result[0]?.id,
      };
    }),
  editTodoTags: t.procedure
    .input(
      z.object({
        todoId: z.string(),
        addTagIds: z.string().array(),
        removeTagIds: z.string().array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Validation of inputs
      let removePromise: Promise<any> | undefined;
      if (input.removeTagIds.length > 0) {
        removePromise = ctx.db
          .delete(tagToTodo)
          .where(
            and(
              eq(tagToTodo.todoId, input.todoId),
              inArray(tagToTodo.tagId, input.removeTagIds)
            )
          );
      }

      await Promise.all([
        removePromise,
        ctx.db
          .insert(tagToTodo)
          .values(
            input.addTagIds.map((tagId) => ({ tagId, todoId: input.todoId }))
          ),
      ]);
    }),
  createTodoGroup: t.procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .insert(todoGroup)
        .values({
          name: input.name,
        })
        .returning({
          id: todoGroup.id,
        });
      return {
        todoGroupId: result[0]?.id,
      };
    }),
  deleteTodoGroup: t.procedure
    .input(
      z.object({
        todoGroupId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.db
        .delete(todoGroup)
        .where(eq(todoGroup.id, input.todoGroupId))
        .returning({
          id: todoGroup.id,
        });
      return {
        todoGroupId: result[0]?.id,
      };
    }),
});

export type TrpcRouter = typeof trpcRouter;

const pickOne = <T>(arr: T[]): T => {
  const item = arr[0];
  if (!item) {
    throw new Error('Cannot pick from empty array');
  }
  return item;
};
