import React from "react";
import { TaskProvider } from "./TaskContext";
import TaskInput from "./TaxkInput";
import TaskList from "./TaskList";

export default function page() {
  return (
    <div>
      <TaskProvider>
        <div className="max-w-md mx-auto mt-10 p-5 border rounded shadow">
          <h1 className="text-xl font-bold mb-4">Task Manager</h1>
          <TaskInput />
          <TaskList />
        </div>
      </TaskProvider>
    </div>
  );
}
