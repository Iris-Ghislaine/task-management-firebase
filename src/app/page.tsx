"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { auth } from "./lib/firebase";
import { signOut } from "firebase/auth";
import { Task } from "./types";
import {
  Moon,
  Sun,
  Plus,
  Search,
  Calendar,
  Clock,
  Flag,
  CheckCircle2,
  Circle,
  AlertCircle,
  Trash2,
  Pencil,
  LogOut,
  PieChart,
  Lightbulb,
} from "lucide-react";

export default function Dashboard() {
  const { user, loading, idToken } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [showStats, setShowStats] = useState(true);

  const API_URL = "/api/tasks";

  const fetchTasks = async () => {
    if (!idToken) return;
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      const processed = data.map((task: any) => {
        let status: "Pending" | "Completed" | "Missed" = "Pending";
        if (task.completed) {
          status = "Completed";
        } else if (task.dueDate) {
          const due = new Date(task.dueDate);
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          if (due < now) status = "Missed";
        }
        return { ...task, status };
      });

      setTasks(processed);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    else if (user && idToken) fetchTasks();
  }, [user, loading, idToken, router]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Completed").length,
    pending: tasks.filter(t => t.status === "Pending").length,
    missed: tasks.filter(t => t.status === "Missed").length,
    high: tasks.filter(t => t.priority === "High").length,
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                         task.description.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idToken) return;

    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDate || null,
      createdAt: editingId ? tasks.find(t => t.id === editingId)?.createdAt : undefined,
    };

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(taskData),
      });

      setTitle("");
      setDescription("");
      setPriority("Low");
      setDueDate("");
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(task.dueDate || "");
    setEditingId(task.id);
  };

  const handleDelete = async (id: string) => {
    if (!idToken) return;
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${idToken}` },
    });
    fetchTasks();
  };

const handleToggleComplete = async (id: string, completed: boolean) => {
  if (!idToken) return;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ completed: !completed }),
  });
  if (res.ok) fetchTasks();
};

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return <p className="text-center mt-20 text-xl">Loading...</p>;
  if (!user) return null;

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-blue-50 via-white to-cyan-50"}`}>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className={`text-5xl font-bold mb-3 bg-gradient-to-r ${darkMode ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-emerald-600 to-teal-600"} bg-clip-text text-transparent`}>
              My Tasks
            </h1>
            <p className={`text-lg ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Welcome back, <span className={`font-bold ${darkMode ? "text-emerald-400":"text-teal-600"}`}>{user.email}</span>
            </p>
            <p className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-500"} flex items-center gap-2`}>
              <Calendar className="h-4 w-4" />
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowStats(!showStats)} className={`p-3 rounded-xl font-medium transition-all ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-cyan-400" : "bg-white hover:bg-slate-50 text-slate-700 shadow-lg"}`}>
              <PieChart className="h-6 w-6" />
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-xl transition-all ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-yellow-400" : "bg-white hover:bg-slate-50 text-slate-700 shadow-lg"}`}>
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
            <button onClick={handleLogout} className="p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all">
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* STATS */}
        {showStats && (
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: "Total", value: stats.total, color: "blue" },
              { label: "Done", value: stats.completed, color: "emerald" },
              { label: "Pending", value: stats.pending, color: "amber" },
              { label: "Missed", value: stats.missed, color: "red" },
              { label: "High", value: stats.high, color: "rose" },
            ].map((stat) => (
              <div key={stat.label} className={`p-5 rounded-2xl ${darkMode ? "bg-slate-800" : "bg-white shadow-xl"}`}>
                <div className={`text-3xl font-bold text-${stat.color}-500`}>{stat.value}</div>
                <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* ADD TASK FORM */}
        <div className={`p-8 rounded-2xl mb-8 shadow-2xl ${darkMode ? "bg-slate-800" : "bg-white"}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" required
                className={`px-6 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all text-lg ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500"}`} />
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className={`px-6 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`} />
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add description..." required rows={3}
              className={`w-full px-6 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all text-lg ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500"}`} />
            <div className="flex gap-4">
              <select value={priority} onChange={(e) => setPriority(e.target.value as any)}
                className={`px-6 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
              <button type="submit" className="flex-1 bg-gradient-to-r bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3">
                <Plus className="h-6 w-6" />
                {editingId ? "Update Task" : "Add Task"}
              </button>
            </div>
          </form>
        </div>

        {/* SEARCH & FILTER */}
        <div className={`p-6 rounded-2xl mb-8 shadow-xl ${darkMode ? "bg-slate-800" : "bg-white"}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`} />
              <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500 ${darkMode ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500"}`} />
            </div>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as any)}
              className={`px-6 py-4 rounded-xl border-2 focus:outline-none focus:ring-4 focus:ring-blue-500 ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}>
              <option value="All">All Priorities</option>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
        </div>

        {/* TASK LIST */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className={`p-16 rounded-2xl text-center ${darkMode ? "bg-slate-800" : "bg-white shadow-xl"}`}>
              <Lightbulb className={`inline-block text-6xl mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`} />
              <p className={`text-xl ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {search || filterPriority !== "All" ? "No tasks match your filters" : "No tasks yet. Create your first one!"}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className={`p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all ${darkMode ? "bg-slate-800" : "bg-white"} border-l-8 ${task.status === "Completed" ? "border-emerald-500" : task.status === "Missed" ? "border-red-500" : "border-teal-500"}`}>
                <div className="flex items-start gap-5">
                  <input type="checkbox" checked={task.completed} onChange={() => handleToggleComplete(task.id, task.completed)}
                    className="mt-1 h-6 w-6 rounded border-2 text-blue-500 focus:ring-4 focus:ring-blue-500 cursor-pointer" />
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${task.completed ? "line-through text-gray-500" : darkMode ? "text-white" : "text-slate-900"}`}>
                      {task.title}
                    </h3>
                    <p className={`${darkMode ? "text-slate-300" : "text-slate-600"} mb-4`}>{task.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${task.priority === "High" ? "bg-rose-100 text-rose-800" : task.priority === "Medium" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                        <Flag className="h-4 w-4" /> {task.priority}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${task.status === "Completed" ? "bg-emerald-100 text-emerald-800" : task.status === "Missed" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>
                        {task.status === "Completed" ? <CheckCircle2 className="h-4 w-4" /> : task.status === "Missed" ? <AlertCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                        {  task.status}
                      </span>
                      {task.dueDate && <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"} flex items-center gap-2`}>
                        <Calendar className="h-4 w-4" /> {new Date(task.dueDate).toLocaleDateString()}
                      </span>}
                    </div>
                    <div className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"} mt-3 flex gap-4`}>
                      <span><Clock className="inline h-3 w-3" /> Created: {new Date(task.createdAt).toLocaleString()}</span>
                      <span><Clock className="inline h-3 w-3" /> Updated: {new Date(task.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(task)} className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg">
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(task.id)} className="p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* TIP */}
        <div className={`mt-12 text-center text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          <Lightbulb className="inline-block mr-2 h-5 w-5" />
          Tip: Your tasks are securely saved and synced across devices
        </div>
      </div>
    </div>
  );
}