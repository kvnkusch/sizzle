import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { todo, tag, tagToTodo } from '@sizzle/db/schema';

// TODO: Should this be idempotent?
export const seedDatabase = async (db: NodePgDatabase) => {
  await db.transaction(async (tx) => {
    const [urgent, optional, misc, custom] = await tx
      .insert(tag)
      .values([
        {
          name: 'urgent',
        },
        {
          name: 'optional',
        },
        {
          name: 'misc',
        },
        {
          name: 'custom',
        },
      ])
      .returning();

    const [todo1, todo2, todo3] = await tx
      .insert(todo)
      .values([
        {
          text: 'Get groceries',
        },
        {
          text: '???',
        },
        {
          text: 'Take out the trash',
          isDone: true,
        },
      ])
      .returning();

    await tx.insert(tagToTodo).values([
      { tagId: urgent!.id, todoId: todo1!.id },
      { tagId: custom!.id, todoId: todo1!.id },
      { tagId: misc!.id, todoId: todo2!.id },
      { tagId: optional!.id, todoId: todo3!.id },
      { tagId: custom!.id, todoId: todo3!.id },
    ]);
  });
};
