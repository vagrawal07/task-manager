import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion } from "framer-motion"; // Import framer-motion for animations
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, setTasks, updateTask, deleteTask }) => {
  // Function to move tasks within the list
  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <motion.ul
        className="task-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {tasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No tasks yet. Add one!</p>
        ) : (
          tasks.map((task, index) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TaskItem
                index={index}
                task={task}
                moveTask={moveTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            </motion.li>
          ))
        )}
      </motion.ul>
    </DndProvider>
  );
};

export default TaskList;
