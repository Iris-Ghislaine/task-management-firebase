"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useAuth } from "./context/AuthContext";
import { db, auth } from "./lib/firebase";
import { Task } from "./types";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [editingId, setEditingId] = useState<string | null>(null);

  // ←←← MOVE fetchTasks HERE (above useEffect) ←←←
  const fetchTasks = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "tasks"),
        where("userEmail", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      const fetchedTasks: Task[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Task));
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      fetchTasks(); 
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const taskData = {
      title,
      description,
      priority,
      completed: false,
      userEmail: user.email,
    };

    try {
      if (editingId) {
        const taskRef = doc(db, "tasks", editingId);
        await updateDoc(taskRef, taskData);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "tasks"), taskData);
      }
      setTitle("");
      setDescription("");
      setPriority("Low");
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setEditingId(task.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hello, {user.email}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-gray-700 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          required
          className="w-full p-2 border mb-4 rounded text-gray-600"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="w-full p-2 border mb-4 rounded text-gray-600"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="w-full p-2 border mb-4 rounded text-gray-600"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-gray-700 px-6 py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update" : "Add"} Task
        </button>
      </form>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks yet. Create one!</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <span
                  className={`inline-inline-block px-3 py-1 rounded text-sm ${
                    task.priority === "High"
                      ? "bg-red-200 text-red-800"
                      : task.priority === "Medium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task.id, task.completed)}
                  className="w-5 h-5"
                />
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}