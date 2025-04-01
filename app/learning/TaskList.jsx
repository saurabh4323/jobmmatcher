"use client";
import { useTask } from "./TaskContext";

const TaskList = () => {
  const { tasks } = useTask();

  return (
    <ul className="mt-4">
      {tasks.map((task, index) => (
        <li key={index} className="p-2 rounded my-1">
          {task}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
