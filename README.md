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

## 🐳 Getting Started

You can run this application in two ways: using Docker (recommended) or running each component separately for development.

### Option 1: Docker (Recommended)

The easiest way to run the entire stack with one command.

#### Prerequisites

- Docker Desktop installed and running.

#### Steps

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

4. **Stop the Application**
   ```bash
   docker-compose down
   ```

### Option 2: Run Components Separately (Development)

Run the backend and frontend independently for active development.

#### Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and npm
- **MySQL 8.0** (running locally or via Docker)

#### Step 1: Start MySQL Database

If you don't have MySQL installed locally, you can run just the database container:

```bash
docker run --name todolist-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=todolist \
  -p 3306:3306 \
  -d mysql:8.0
```

#### Step 2: Run Backend

```bash
cd backend/ToDoList-Application

# Update application.properties with your MySQL credentials if needed
# Default expects: localhost:3306, database: todolist, user: root, password: root

# Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

#### Step 3: Run Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

The frontend will start on **http://localhost:5173** (Vite default port)

> **Note**: When running separately, you may need to configure CORS in the backend or update the frontend API base URL in your code.

## 🧪 Testing

The project includes comprehensive automated tests for both frontend and backend layers.

### Backend Tests (JUnit & Mockito)

Tests the Service logic, Repository queries, and Controller endpoints.

#### Run Tests

```bash
cd backend/ToDoList-Application
mvn test
```

#### View Detailed Test Results

```bash
# Run tests with detailed output
mvn test

# Generate HTML test report (Surefire Reports)
mvn surefire-report:report

# View the report at:
# target/surefire-reports/index.html
```

#### View Coverage Report (JaCoCo)

```bash
mvn clean test jacoco:report

# Open the report at:
# target/site/jacoco/index.html
```

The JaCoCo report provides:
- **Line Coverage**: Percentage of code lines executed
- **Branch Coverage**: Percentage of decision points tested
- **Class/Method Coverage**: Detailed breakdown by class and method
- **Visual Indicators**: Green (covered), yellow (partially covered), red (not covered)

**Test Coverage includes:**
- ✅ Top 5 query logic
- ✅ Task creation flow
- ✅ Exception handling
- ✅ Repository CRUD operations
- ✅ Controller endpoint responses

### Frontend Tests (Vitest)

Tests component rendering, user interactions, and API integration.

#### Run Tests

```bash
cd frontend
npm install  # If not already installed
npm test
```

#### Run Tests with UI

```bash
npm run test:ui
```

This opens an interactive browser interface showing:
- Test results in real-time
- Code coverage visualization
- Individual test case details

#### Generate Coverage Report

```bash
npm run test:coverage

# View the HTML report at:
# coverage/index.html
```

**Test Coverage includes:**
- ✅ TaskForm validation
- ✅ TaskCard display and interactions
- ✅ Navbar rendering
- ✅ API integration mocks
- ✅ User event handling

#### Continuous Testing (Watch Mode)

For active development, run tests in watch mode:

```bash
npm run test:watch
```

Tests will automatically re-run when you save changes to your code.

## Demo Video

https://github.com/user-attachments/assets/2ddcaa41-0658-4c01-b429-d56c7e3a804a

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
