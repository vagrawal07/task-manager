import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

const ITEM_TYPE = "TASK";

const TaskItem = ({ task, index, moveTask, updateTask, deleteTask }) => {
  const ref = useRef(null);

  // Drag handler
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop handler
  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className="task-item"
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => updateTask({ ...task, completed: !task.completed })}
      />
      <span className={task.completed ? "completed" : ""}>{task.title}</span>
      <button
        className="edit-btn"
        onClick={() =>
          updateTask({ ...task, title: prompt("Edit task:", task.title) || task.title })
        }
      >
        ✏️
      </button>
      <button className="delete-btn" onClick={() => deleteTask(task.id)}>❌</button>
    </li>
  );
};

export default TaskItem;
