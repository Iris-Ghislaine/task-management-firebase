export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
  status: "Pending" | "Completed" | "Missed"; 
  userEmail: string;
  createdAt: string; 
  updatedAt: string; 
  dueDate?: string; 
}