# Task Manager App (Next.js + Firebase + Firestore)

A secure and modern Task Management application built using **Next.js (App Router)**, **Firebase Authentication**, and **Firestore**. Includes authenticated CRUD operations, dark mode, search, filter, and automatic task status (Pending / Completed / Missed).

## Features

- Firebase Authentication (ID Token + Server verification)
- Task CRUD (Create, Read, Update, Delete)
- Priorities: Low, Medium, High
- Due dates + auto status (Pending / Completed / Missed)
- Dark / Light theme toggle
- Search & priority filters
- Responsive UI with TailwindCSS and Lucide Icons


## Tech Stack

- Next.js (App Router)
- React
- Firebase Auth (Client)
- Firebase Admin SDK (Server)
- Firestore
- TailwindCSS
- Lucide React Icons

## Project Structure

```
src/
├── app/
│ ├── api/
│ │ └── tasks/
│ │ ├── route.ts
│ │ └── [id]/route.ts
│ ├── context/
│ │ └── AuthContext.tsx
│ ├── dashboard/
│ │ └── page.tsx
│ ├── login/
│ │ └── page.tsx
│ └── lib/
│ ├── firebase.ts
│ └── admin.ts
├── types/
│ └── index.ts

```

## Authentication Flow

1. User logs in → Firebase returns an ID token  
2. AuthContext stores `user`, `idToken`, and `loading`  
3. Requests to API include header:
4. Server verifies token using `adminAuth.verifyIdToken()` and performs Firestore operations

## API Endpoints

### GET `/api/tasks`
Returns tasks for the authenticated user

### POST `/api/tasks`
Example body:

{
  "title": "Study React",
  "description": "Finish hooks section",
  "priority": "High",
  "dueDate": "2025-02-10" 
}

### PUT /api/tasks/[id]

Example body:
{
  "completed": true,
  "title": "Updated Task Title"
}
### DELETE /api/tasks/[id]

Deletes a task by ID

All endpoints require header:

Authorization: Bearer <idToken>

### Environment Variables

Create .env.local:

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PROJECT_ID=your_project_id

### Installation

```npm install```
### To run the project

```npm run dev```
App runs at: ```http://localhost:3000```

### Deployment 
