import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  primaryKey,
} from 'drizzle-orm/pg-core';

const tableBase = {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
};

export const todo = pgTable('todo', {
  ...tableBase,
  text: text('text').notNull(),
  isDone: boolean('is_done').notNull().default(false),
  groupId: uuid('group_id').references(() => todoGroup.id),
});

export const todoGroup = pgTable('todo_group', {
  ...tableBase,
  name: text('name').notNull(),
});

export const tag = pgTable('tag', {
  ...tableBase,
  name: text('name').notNull(),
});

export const tagToTodo = pgTable(
  'tag_to_todo',
  {
    todoId: uuid('todo_id')
      .notNull()
      .references(() => todo.id),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tag.id),
  },
  (table) => {
    return {
      pk: primaryKey(table.todoId, table.tagId),
    };
  }
);
