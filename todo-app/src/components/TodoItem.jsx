import { useState } from "react";

function TodoItem({ todo, toggleComplete, deleteTodo, updateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  const handleChange = () => {
    toggleComplete(todo.id, todo.is_complete);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleUpdate = () => {
    updateTodo(todo.id, text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="todo-item">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleUpdate}>Save</button>
      </div>
    );
  }

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.is_complete}
        onChange={handleChange}
      />
      <span
        style={{ textDecoration: todo.is_complete ? "line-through" : "none" }}
      >
        {todo.text}
      </span>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={handleDelete} className="delete-btn">
        Delete
      </button>
    </div>
  );
}

export default TodoItem;
