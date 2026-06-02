# Architectural Improvement Plan

This document outlines the planned improvements for the AtHomeServer architecture to ensure better scalability, testability, and adherence to clean architecture principles.

## 1. Apply Proper Dependency Injection (DI)
**Goal:** Adhere to the Dependency Inversion Principle (DIP) to make testing easier and decouple components.
*   **Action:** Stop instantiating dependencies (like `RedisSessionService` and `TrojoNetworksClient`) inside the `__init__` methods of Services and Use Cases.
*   **Implementation:** Inject these dependencies through the constructor. Leverage FastAPI's `Depends()` at the route level to resolve the dependency graph and pass the instances down to the Controllers and Use Cases.

## 2. Introduce Infrastructure and Integrations Layers
**Goal:** Properly separate domain logic from external technological concerns.
*   **Action (Infrastructure):** Move technology-specific adapters out of the `application` layer. For example, rename or move `application/redis` to an `infrastructure/` or `adapters/` directory, representing it as a Session or Cache interface to the domain.
*   **Action (Integrations):** Move external API clients (like `trojonetworks`) out of the `web` layer. Create an `integrations/` (or `infrastructure/`) directory to house these external outgoing HTTP clients. The `web` layer should strictly be for *incoming* HTTP requests.

## 3. Flatten the Pipeline (Remove Unnecessary Services)
**Goal:** Reduce boilerplate and prevent over-abstraction.
*   **Action:** If a `Service` class is acting purely as a pass-through to a `UseCase` (e.g., `AuthService` just calling `AuthLoginUseCase`), eliminate the `Service`.
*   **Implementation:** Have the `Controller` directly inject and invoke the required `Use Cases`. The flow becomes: `Router` -> `Controller` -> `UseCase`.

## 4. Standardize Domain Errors
**Goal:** Ensure predictable error handling and HTTP response mapping.
*   **Action:** Stop raising standard Python exceptions (like `ValueError` or `RuntimeError`) inside Use Cases, as they bypass the `Result` pattern and `CustomException` handlers.
*   **Implementation:** Standardize on returning the `Err` type from the `Result` pattern, or explicitly raise domain-specific subclasses of `CustomException` (e.g., `InvalidStateError`) so the `@resolve_response` decorator can map them to the correct HTTP status codes.
