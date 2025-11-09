// src/app/api/tasks/[id]/route.ts
import { db } from "@/app/lib/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { adminAuth } from "@/app/lib/admin";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authToken.split("Bearer ")[1];
  try {
    await adminAuth.verifyIdToken(token);
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // AWAIT params — this is the fix!
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Task ID required" }, { status: 400 });
  }

  const body = await req.json();
  const taskRef = doc(db, "tasks", id);

  await updateDoc(taskRef, {
    ...body,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ id, ...body, updatedAt: new Date().toISOString() });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    await adminAuth.verifyIdToken(token);
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { id } = await params; // AWAIT HERE TOO
  if (!id) {
    return NextResponse.json({ error: "Task ID required" }, { status: 400 });
  }

  const taskRef = doc(db, "tasks", id);
  await deleteDoc(taskRef);

  return NextResponse.json({ message: "Task deleted successfully" });
}