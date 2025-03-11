import React, { useState, useEffect, useContext } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { ThemeContext } from "./context/ThemeContext";
import "./style.css";

const App = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [filter, setFilter] = useState("all"); // Task filter state

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => setTasks([...tasks, task]);
  const updateTask = (updatedTask) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };
  const deleteTask = (id) => setTasks(tasks.filter((task) => task.id !== id));

  // Filter Tasks Based on Status
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <div className="header">
        <h2>Task Manager</h2>
        <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Task Filters */}
      <div className="filters">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>
          All
        </button>
        <button onClick={() => setFilter("pending")} className={filter === "pending" ? "active" : ""}>
          Pending
        </button>
        <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>
          Completed
        </button>
      </div>

      <TaskForm addTask={addTask} />
      <TaskList tasks={filteredTasks} setTasks={setTasks} updateTask={updateTask} deleteTask={deleteTask} />
    </div>
  );
};

export default App;
