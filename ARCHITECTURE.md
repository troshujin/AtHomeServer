# System Architecture and Code Hierarchy

This document outlines the architectural structure and directory hierarchy for the `AtHomeServer` project. The project is a full-stack application composed of a modern web frontend, a layered Python backend API, and a containerized deployment setup.

## High-Level Repository Structure

The repository is organized into three primary top-level directories, separating the frontend client, backend server, and deployment configurations:

```text
AtHomeServer/
├── backend/    # Python-based API server (FastAPI/Clean Architecture)
├── frontend/   # Vue 3 Single Page Application (Vite + TypeScript)
├── deploy/     # Infrastructure and deployment configurations (Nginx, SSL)
├── docker-compose.yml
└── Makefile
```

---

## Backend Architecture (`/backend`)

The backend is built using Python and follows **Clean Architecture** principles. It separates concerns into distinct layers to ensure that business logic is isolated from external frameworks, databases, and UI (HTTP presentation).

### Hierarchy & Layers

```text
backend/
├── application/     # Application logic (Use Cases / Services)
├── core/            # Cross-cutting concerns (Config, Exceptions, Decorators)
├── domain/          # Enterprise business rules and core entities
├── infrastructure/  # External integrations (Database, Cache, APIs)
└── presentation/    # Delivery mechanism (HTTP Endpoints / FastAPI)
```

#### 1. `presentation/` (Delivery / Interface)

Handles incoming HTTP requests and returns responses. It depends on the `application` layer to process the requests.

- **`endpoints/`**: Contains API route definitions (e.g., `auth.py`, `files.py`). Maps HTTP requests to application use cases.
- **`app/`**: Application factory and global server setup.

#### 2. `application/` (Use Cases)

Contains the application-specific business rules. It orchestrates the flow of data to and from the domain entities and directs those entities to use their critical business rules to achieve the goals of the use case.

- **`usecases/`**: Specific business workflows (e.g., `login.py`, `callback.py`).
- **`dto.py`**: Data Transfer Objects used to pass data in and out of the application layer safely.

#### 3. `domain/` (Entities)

The core of the system. Contains enterprise-wide business rules, models, and interfaces (protocols). This layer has **no dependencies** on any other layer in the application.

#### 4. `infrastructure/` (Frameworks & Drivers)

Implements interfaces defined by the application/domain layers. Contains all details regarding databases, third-party libraries, and external services.

- **`database/`**: SQLAlchemy models (`models/`), Alembic migrations (`alembic/`), and connection pooling.
- **`cache/`**: Redis client implementations and key generation rules.
- **`trojonetworks/`**: External API clients and specific third-party service integrations.

#### 5. `core/` (Cross-cutting Concerns)

Utility code shared across the entire backend.

- **`configuration.py`**: Environment variable loading and typed settings.
- **`exceptions/`**: Custom error classes mapping to application states (e.g., `auth.py`).
- **`decorators/`**: Reusable wrappers for functionality like standardized API responses.

---

## Frontend Architecture (`/frontend`)

The frontend is a Single Page Application (SPA) built with **Vue 3**, **TypeScript**, and **Vite**.

### Hierarchy & Structure

```text
frontend/
├── src/
│   ├── components/  # Reusable UI components
│   ├── stores/      # Global state management
│   ├── styles/      # Global styling and SCSS configuration
│   ├── App.vue      # Root component
│   └── main.ts      # Application entrypoint
├── public/          # Static assets served as-is (favicon, etc.)
└── index.html       # Main HTML template
```

#### 1. `components/`

Modular Vue components. Often subdivided by feature or architectural significance (e.g., `layout/NavBar.vue`).

#### 2. `stores/`

State management logic, typically utilizing Pinia (e.g., `counter.ts`). Contains global reactive state, getters, and actions.

#### 3. `styles/`

SCSS architectural framework for the application.

- **`_variables.scss`**: Centralized design tokens (colors, fonts, sizing).
- **`_mixins.scss`**: Reusable CSS utility functions.
- **`base.scss`**: Global resets and base typography.
- **`layout/`**: Styles specific to major layout sections (e.g., `_navbar.scss`).

---

## Deployment & Infrastructure (`/deploy` & Root)

The project leverages Docker for containerization, ensuring consistency across development and production environments.

- **`docker-compose.yml`**: Orchestrates the multi-container setup (Backend server, Frontend web server, Redis, Nginx reverse proxy). The PostgreSQL database is **not** part of this compose file — it runs on its own, and the backend reaches it via the connection settings in `backend/.env`.
- **`deploy/nginx/`**: Nginx configuration (`nginx.conf`) acting as an API Gateway and static file server.
- **`deploy/certs/`**: SSL certificates for local HTTPS development.
- **`Makefile`**: Encapsulates common developer workflows and CLI commands for building, testing, and running the project.
