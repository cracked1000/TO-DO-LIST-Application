# 📝 Full Stack To-Do List Application

A robust, containerized web application designed to manage daily tasks efficiently. This project demonstrates a full-stack implementation using modern technologies, adhering to clean architecture principles and microservices patterns.

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 (Vite), Tailwind CSS |
| **Backend** | Java 17, Spring Boot 3, Spring Data JPA |
| **Database** | MySQL 8.0 |
| **DevOps** | Docker, Docker Compose, Nginx (Reverse Proxy) |
| **Testing** | JUnit 5, Mockito (Backend) / Vitest (Frontend) |

## 🚀 Key Features

- ✅ **Task Creation**: Users can create tasks with a title and detailed description.
- 🧠 **Smart Filtering**: The dashboard automatically filters to show only the 5 most recent incomplete tasks, keeping the view clutter-free.
- ✍️ **Edit & Update**: Tasks can be edited in-place to correct typos or update descriptions.
- 🏁 **Task Completion**: Marking a task as "Done" removes it from the active view (persisted in DB).
- 🌍 **Timezone Aware**: Server automatically handles timestamps in Sri Lanka Standard Time regardless of the host environment.
- 🐳 **Fully Dockerized**: One-command setup for the entire stack (DB, Backend, Frontend).

## 🗂️ Project Structure

```
ToDoList-Project/
├── docker-compose.yml              # Orchestration for DB, Backend, and Frontend
├── backend/
│   └── ToDoList-Application/
│       ├── src/                    # Java Source Code
│       ├── pom.xml                 # Maven Dependencies
│       └── Dockerfile              # Multi-stage build for Spring Boot
└── frontend/
    ├── src/                        # React Components
    ├── public/
    ├── nginx.conf                  # Nginx Reverse Proxy Configuration
    └── Dockerfile                  # Multi-stage build for React + Nginx
```

## 🐳 Getting Started (Docker)

The easiest way to run the application is using Docker. This ensures all dependencies (Java, Node, MySQL) are handled automatically.

### Prerequisites

- Docker Desktop installed and running.

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/cracked1000/TO-DO-LIST-Application.git
   cd ToDoList-Project
   ```

2. **Build and Run**
   ```bash
   docker-compose up --build
   ```
   > This may take a few minutes on the first run as it downloads images and builds the JAR file.

3. **Access the App**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8080/tasks

## 🧪 Testing

The project includes comprehensive automated tests for both frontend and backend layers.

### 1. Backend Tests (JUnit & Mockito)

Tests the Service logic, Repository queries, and Controller endpoints.

```bash
cd backend/ToDoList-Application
mvn test
```

**Coverage includes:**
- Top 5 query logic
- Task creation flow
- Exception handling

### 2. Frontend Tests (Vitest)

Tests component rendering, user interactions, and API integration.

```bash
cd frontend
npm install
npm test
```

**Coverage includes:**
- TaskForm validation
- TaskCard display
- Navbar rendering

## 🛠 API Endpoints

The backend provides a RESTful API consumed by the frontend via Nginx proxy.

| HTTP Method | Endpoint | Description |
|------------|----------|-------------|
| `GET` | `/tasks` | Retrieve the top 5 recent incomplete tasks. |
| `POST` | `/tasks` | Create a new task. Payload: `{ "name": "...", "description": "..." }` |
| `PUT` | `/tasks/{id}` | Update an existing task's details. |
| `PUT` | `/tasks/{id}/complete` | Mark a task as completed. |

## 💡 Architecture & Design Decisions

### 1. Nginx Reverse Proxy

Instead of exposing the backend directly to the browser, I used Nginx to serve the React app. It forwards any request starting with `/tasks` to the backend container.

**Benefit**: Eliminates CORS issues completely and mimics a real production environment.

### 2. "Top 5" Efficiency

The requirement to show only the "5 most recent tasks" is implemented at the Database level using a custom JPA query (`findTop5ByCompletedFalseOrderByIdDesc`), rather than fetching all rows and filtering in Java.

**Benefit**: Significantly improves performance and reduces memory usage as the dataset grows.

### 3. Robust Error Handling

The application features a global exception handler in the backend to return clean HTTP 404/500 errors, and the frontend includes a "Retry Connection" mechanism to handle cases where the backend takes longer to start than the frontend.

## 📄 License

MIT © 2025