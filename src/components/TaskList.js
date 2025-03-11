import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
      <ul className="task-list">
        {tasks.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777" }}>No tasks yet. Add one!</p>
        ) : (
          tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              index={index}
              task={task}
              moveTask={moveTask}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          ))
        )}
      </ul>
    </DndProvider>
  );
};

export default TaskList;
