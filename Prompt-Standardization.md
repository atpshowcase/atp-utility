# Code Standardization & Architecture Prompt

## Core Philosophy
The codebase must be highly maintainable, scalable, and easy to navigate. We will adhere strictly to **Clean Architecture** principles and a **Modular (Feature-Based) Folder Structure**.

## Backend Standardization (Golang)
- **Architecture**: Clean Architecture (Domain -> Repository -> Usecase -> Delivery/Handler).
- **Module Separation**: Each feature (e.g., `pdf`, `image`, `users`) must be isolated in its own folder inside `internal/modules/`.
- **Database**: Use PostgreSQL. Migrations and connection handling should be centralized in `internal/db/`.
- **Error Handling**: Use a centralized, consistent error handling strategy across all modules.
- **Routing**: Group routes by module in the delivery layer.

### Expected Backend Structure:
```text
backend/
├── cmd/
│   └── api/          # Main application entry point
├── internal/
│   ├── config/       # Configuration and environment setup
│   ├── db/           # Database connection and migrations
│   └── modules/      # Feature-based modules
│       ├── pdf/
│       │   ├── domain/     # Entities and repository interfaces
│       │   ├── repository/ # PostgreSQL implementations
│       │   ├── usecase/    # Business logic
│       │   └── handler/    # HTTP/REST delivery (Gin/Fiber/etc)
└── pkg/              # Shared utilities (logger, error handling)
```

## Frontend Standardization (Next.js)
- **Architecture**: Feature-driven module structure.
- **Framework**: Next.js App Router.
- **Components**: Separate global/shared UI components from feature-specific components.
- **API Calls**: Encapsulate API logic in specific `services/` folders within each module.

### Expected Frontend Structure:
```text
frontend/
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   ├── modules/        # Feature-based modules
│   │   ├── pdf-tools/
│   │   │   ├── components/ # UI components specific to PDF tools
│   │   │   ├── hooks/      # Custom React hooks
│   │   │   └── services/   # API call definitions
│   ├── components/     # Shared/UI global components
│   └── lib/            # Utility functions and API client setup
```
