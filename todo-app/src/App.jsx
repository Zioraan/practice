import { useState, useEffect } from "react";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import "./App.css";
import { supabase } from "./supabaseClient";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos();
  }, []);

  async function getTodos() {
    const { data } = await supabase.from("todos").select();
    setTodos(data || []);
  }

  const addTodo = async (text) => {
    await supabase.from("todos").insert({ text });
    await getTodos();
  };

  const toggleComplete = async (id, is_complete) => {
    await supabase
      .from("todos")
      .update({ is_complete: !is_complete })
      .match({ id });
    await getTodos();
  };

  const deleteTodo = async (id) => {
    await supabase.from("todos").delete().match({ id });
    await getTodos();
  };

  const updateTodo = async (id, text) => {
    await supabase.from("todos").update({ text }).match({ id });
    await getTodos();
  };

  return (
    <>
      <h1>Todo App</h1>
      <AddTodoForm addTodo={addTodo} />
      <TodoList
        todos={todos}
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
        updateTodo={updateTodo}
      />
    </>
  );
}

export default App;
