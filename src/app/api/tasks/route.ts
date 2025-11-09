import { adminAuth } from "@/app/lib/admin";
import { db } from "@/app/lib/firebase";
import { Task } from "@/app/types";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];
  let userEmail = "";

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    userEmail = decoded.email!;
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const q = query(collection(db, "tasks"), where("userEmail", "==", userEmail));
  const snapshot = await getDocs(q);
  const tasks = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    } as Task;
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];
  let userEmail = "";

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    userEmail = decoded.email!;
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();
  const now = new Date().toISOString();

  const newTask = {
    ...body,
    userEmail,
    completed: false,
    createdAt: body.editingId ? body.createdAt || now : now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, "tasks"), newTask);
  return NextResponse.json({ id: docRef.id, ...newTask });
}