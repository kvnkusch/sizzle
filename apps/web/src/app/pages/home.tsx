import { trpc } from '@sizzle/trpc-client';
import { useState } from 'react';

export function HomePage() {
  const todos = trpc.todos.useQuery();
  const createTodo = trpc.createTodo.useMutation({
    onSuccess: () => todos.refetch(),
  });

  if (!todos.data) {
    return null;
  }

  return (
    <div className="container mx-auto flex h-full justify-center overflow-hidden p-4">
      <div className="flex w-96 flex-col items-stretch justify-center">
        {todos.data.map((todo) => (
          <TodoListItem todo={todo} key={todo.id} />
        ))}
        <AddTodo
          onAdd={(text) => {
            createTodo.mutate({
              text,
            });
          }}
        />
      </div>
    </div>
  );
}

const TodoListItem = ({
  todo,
}: {
  todo: {
    id: string;
    text: string;
    isDone: boolean;
  };
}) => {
  const [expanded, setExpanded] = useState(false);
  const todoDetails = trpc.todo.useQuery(
    {
      todoId: todo.id,
    },
    {
      enabled: expanded,
    }
  );

  return (
    <div key={todo.id} className="m-2 overflow-hidden rounded">
      <div
        className={`flex justify-between bg-gray-200 p-4 hover:cursor-pointer hover:bg-gray-300`}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span>{todo.text}</span>
        {todo.isDone ? <span>✅</span> : null}
      </div>
      {expanded && (
        <div className="min-h-10 flex bg-gray-100 p-4">
          {!todoDetails.data && 'loading'}
          {todoDetails.data && (
            <>
              <div className="w-6/12">
                <div>Group:</div>
                {todoDetails.data.group ? todoDetails.data.group.name : 'None'}
              </div>
              <div className="w-6/12">
                Tags:
                {todoDetails.data.tags.map((tag) => (
                  <div key={tag.id}>{tag.name}</div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const AddTodo = ({ onAdd }: { onAdd: (text: string) => void }) => {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');

  return (
    <div className="m-2 rounded bg-gray-200 p-4 hover:bg-gray-300">
      {!adding && (
        <div
          className="flex justify-center  hover:cursor-pointer"
          onClick={() => setAdding(true)}
        >
          Add Todo
        </div>
      )}
      {adding && (
        <input
          className="w-full"
          type="text"
          value={text}
          autoFocus
          onBlur={() => {
            if (text.length === 0) {
              setAdding(false);
            }
          }}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (text.length === 0) {
              return;
            }
            if (e.key === 'Enter') {
              onAdd(text);
              setAdding(false);
              setText('');
            }
          }}
        />
      )}
    </div>
  );
};
