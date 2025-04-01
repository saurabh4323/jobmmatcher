"use client";
import { useRef, useState } from "react";
import { useTask } from "./TaskContext";

const TaskInput = () => {
  const { addTask } = useTask();
  const [task, setTask] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() === "") return;
    addTask(task);
    setTask("");
    inputRef.current.focus(); // Focus back on input
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a task"
        className="border p-2 rounded w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>
    </form>
  );
};

export default TaskInput;
