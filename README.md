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

### Screenshots
### SignUp page

<img width="1104" height="854" alt="image" src="https://github.com/user-attachments/assets/b595531b-37e5-446c-b0f5-f04cd2b113b7" />

### SignIn page

<img width="1662" height="877" alt="image" src="https://github.com/user-attachments/assets/369a05bd-1dd1-4e15-9dae-6555ba45615d" />

### Landing page

<img width="1248" height="849" alt="image" src="https://github.com/user-attachments/assets/8fbaae57-fd55-4c5d-9ea3-058c150c02e3" />

<img width="1314" height="868" alt="image" src="https://github.com/user-attachments/assets/a7316fd8-48c8-4d26-a9b8-fd5d3937d126" />

### Darkmode

<img width="1272" height="865" alt="image" src="https://github.com/user-attachments/assets/7188af47-0c0f-4add-9bb5-fd9f69e3af77" />
<img width="1501" height="868" alt="image" src="https://github.com/user-attachments/assets/e3987fe3-f597-4d87-9ee9-adcfbf103f51" />


### Installation

```npm install```
### To run the project

```npm run dev```
App runs at: ```http://localhost:3000```

### Deployment 
Live Demo : 


