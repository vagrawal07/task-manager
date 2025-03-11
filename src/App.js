import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { motion } from "framer-motion"; // Import framer-motion
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { ThemeContext } from "./context/ThemeContext";
import "./style.css";

const App = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("tasks")) || []);
  const [filter, setFilter] = useState("all");

  // States for undo/redo functionality
  const [history, setHistory] = useState([tasks]);  // History of task states
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);  // Index for current state in history

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Function to update the history state after a task modification
  const updateHistory = useCallback((newTasks) => {
    const updatedHistory = history.slice(0, currentHistoryIndex + 1);  // Slice to the current point
    setHistory([...updatedHistory, newTasks]);
    setCurrentHistoryIndex(updatedHistory.length);
  }, [history, currentHistoryIndex]);

  // Memoize the addTask, updateTask, and deleteTask functions with useCallback
  const addTask = useCallback((task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    updateHistory(newTasks);
  }, [tasks, updateHistory]);

  const updateTask = useCallback((updatedTask) => {
    const newTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(newTasks);
    updateHistory(newTasks);
  }, [tasks, updateHistory]);

  const deleteTask = useCallback((id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    updateHistory(newTasks);
  }, [tasks, updateHistory]);

  // Undo and Redo functionality
  const undo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setTasks(history[currentHistoryIndex - 1]);
    }
  };

  const redo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setTasks(history[currentHistoryIndex + 1]);
    }
  };

  // Memoize filtered tasks to prevent unnecessary re-renders
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "all") return true;
      if (filter === "pending") return !task.completed;
      if (filter === "completed") return task.completed;
      return true;
    });
  }, [tasks, filter]);

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
      
      {/* Animated Task List */}
      <motion.div
        className="task-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TaskList tasks={filteredTasks} setTasks={setTasks} updateTask={updateTask} deleteTask={deleteTask} />
      </motion.div>

      {/* Undo/Redo Buttons */}
      <div className="undo-redo">
        <button onClick={undo} disabled={currentHistoryIndex === 0}>
          Undo
        </button>
        <button onClick={redo} disabled={currentHistoryIndex === history.length - 1}>
          Redo
        </button>
      </div>
    </div>
  );
};

export default App;
