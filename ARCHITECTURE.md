# AtHomeServer Architecture

This project follows a Clean Architecture / Domain-Driven Design (DDD) inspired structure. The goal is to separate concerns, isolate business logic from the framework, and ensure high testability through Dependency Injection.

## Core Principles

1.  **Separation of Concerns:** HTTP routing, business logic, and external integrations are strictly isolated.
2.  **Dependency Inversion (DIP):** High-level modules (Use Cases) do not depend on low-level modules (Database, Redis, External APIs). Both depend on abstractions, and dependencies are injected at runtime.
3.  **Result Pattern:** Instead of relying heavily on exceptions for control flow, the application utilizes a functional `Result[T]` type (`Ok`, `Err`) to make success and failure states explicit.

## Directory Structure

Here is the envisioned directory structure reflecting the separation of layers:

```text
AtHomeServer/
├── core/                   # Application-wide configurations and base utilities
│   ├── common/             # Base classes, exceptions, and decorators (Result pattern)
│   ├── configuration.py    # Environment variables and settings
│   └── db/                 # Database connection setup and base ORM models
├── web/                    # The Presentation Layer (Incoming HTTP)
│   ├── endpoints/          # FastAPI Routers (Groups of routes)
│   └── app/                # Frontend application (Vue/React/etc.)
├── application/            # The Domain / Business Logic Layer
│   ├── auth/
│   │   ├── usecases/       # Specific business scenarios (e.g., Login, Callback)
│   │   ├── controller.py   # Orchestrates UseCases, maps HTTP inputs to DTOs
│   │   └── dto.py          # Data Transfer Objects for the auth domain
│   └── files/              # Other domain boundaries...
├── infrastructure/         # The Data / External Interfaces Layer
│   ├── database/           # Concrete Repository implementations (Postgres/SQLAlchemy)
│   ├── cache/              # Concrete Cache implementations (Redis sessions)
│   └── integrations/       # Outgoing external API clients (TrojoNetworks)
├── tests/                  # Root testing directory
│   ├── conftest.py         # Global pytest fixtures (e.g., mock DB, app instance)
│   ├── unit/               # Tests business logic in isolation (No real DB/Network)
│   │   ├── application/    # Tests UseCases using mocked dependencies
│   │   └── core/           # Tests core utilities (like the Result pattern)
│   ├── integration/        # Tests adapter implementations against real/test infrastructure
│   │   └── infrastructure/ # Tests real Postgres/Redis/External API adapters
│   └── e2e/                # Tests the full HTTP flow (Router -> Controller -> UseCase -> DB)
│       └── web/            # Uses FastAPI TestClient to test the complete API endpoints
└── deploy/                 # Deployment and Operational infrastructure
    ├── nginx/              # Nginx reverse proxy configuration
    └── certs/              # SSL Certificates
```

## Layer Responsibilities

*   **`web/` (Presentation):** Defines the API endpoints (Routers). Its only job is to receive the HTTP request, extract parameters/bodies, inject dependencies via FastAPI's `Depends`, and hand the request off to the Controller.
*   **`application/` (Domain):** Contains the core business rules. 
    *   **Controllers:** Act as the orchestrators for a specific domain. They take validated input from the router and pass it to the appropriate Use Case.
    *   **Use Cases:** Contain the step-by-step business logic for a single feature (e.g., `AuthCallbackUseCase`).
*   **`infrastructure/` (Adapters):** Contains implementations for talking to the outside world. This includes databases, Redis caches, and external APIs (integrations).
*   **`core/`:** Shared tools, base classes, and configuration that multiple layers might need to bootstrap.
*   **`deploy/`:** Deployment configurations, reverse proxy setups (Nginx), and SSL certificates. Keeps operational concerns separate from application code.

## The API Call Flow

When an API request comes in, it flows through the layers from the outside in, and then back out.

**Example: A User requests the `/auth/callback` endpoint.**

1.  **Router (`web/endpoints/auth.py`):**
    *   Receives the `GET /auth/callback` request.
    *   FastAPI parses the query parameters (`code`, `state`).
    *   FastAPI resolves the dependency graph using `Depends()`, instantiating the `RedisSessionService`, `TrojoNetworksClient`, and the `AuthCallbackUseCase`. It injects these into the `AuthController`.
    *   The router calls the controller: `await controller.callback(code, state)`.

2.  **Controller (`application/auth/controller.py`):**
    *   The Controller receives the raw data.
    *   It wraps the call in a `try/except` block (or relies on the `@resolve_response` decorator).
    *   It calls the specific Use Case: `await self.callback_use_case(AuthCallbackDto(code=code, state=state))`.

3.  **Use Case (`application/auth/usecases/callback.py`):**
    *   This is where the actual business logic happens.
    *   It uses injected interfaces to do its job:
        *   Calls `self.redis.get_login_session(state)` to verify the state.
        *   Calls `self.api_client.request_token(...)` to exchange the code.
        *   Applies business rules (e.g., verifying PKCE).
        *   Calls `self.redis.save_session(...)` to store the new tokens.
    *   If a rule is violated, it returns an `Err(CustomException(...))` or raises a specific domain exception.
    *   If successful, it returns an `Ok(AuthCallbackResultDto(...))`.

4.  **Decorator (`core/common/decorators/response.py`):**
    *   The `@resolve_response` decorator intercepts the `Result` object returned by the Controller.
    *   If it's an `Ok`, it unwraps the value and formats it as a `JSONResponse` (or a `RedirectResponse` in this specific callback case).
    *   If it's an `Err`, it extracts the `CustomException` and formats it as a `JSONResponse` with the appropriate HTTP error code.

5.  **Response:** The user receives the final HTTP response (e.g., a 303 Redirect to the frontend).
