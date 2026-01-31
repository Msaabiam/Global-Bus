# Tour Vibes

## Overview

Tour Vibes is a real-time virtual tour application where users can join themed bus tours through various cities and campuses around the world. Users become "passengers" on virtual buses, can chat with other passengers via WebSocket, participate in polls to decide destinations, and experience ambient visual effects themed to each tour region.

The application features a React frontend with Framer Motion animations, a Node.js/Express backend with WebSocket support for real-time communication, and PostgreSQL database for persistent storage of rooms, passengers, messages, and polls.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for complex UI animations and transitions
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend is organized as a single-page application with pages in `client/src/pages/` and reusable components in `client/src/components/`. Custom hooks handle mobile detection, toast notifications, and WebSocket connections.

### Backend Architecture
- **Framework**: Express 5 on Node.js
- **Real-time Communication**: WebSocket (ws library) for live chat and updates
- **API Pattern**: RESTful endpoints for CRUD operations, WebSocket for real-time events
- **Server Entry**: `server/index.ts` with HTTP server wrapping Express

The server uses a rooms-based model where passengers join rooms, send messages, and vote on polls. WebSocket connections are tracked per room for targeted broadcasts.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Managed via `drizzle-kit push`

Core entities:
- **rooms**: Virtual tour buses with destinations and styles
- **passengers**: Users with avatars, XP, and levels
- **messages**: Chat messages within rooms
- **polls/pollOptions/pollVotes**: Voting system for destination choices

### Build System
- **Development**: Vite dev server with HMR proxied through Express
- **Production**: Custom build script (`script/build.ts`) using esbuild for server bundling and Vite for client bundling
- **Output**: Combined into `dist/` directory with static serving

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management
- **connect-pg-simple**: PostgreSQL session store (available but sessions not currently implemented)

### Frontend Libraries
- **@radix-ui/***: Headless UI primitives for accessible components
- **shadcn/ui**: Pre-built component library using Radix primitives
- **Framer Motion**: Animation library for page transitions and effects
- **TanStack React Query**: Server state management and caching

### Real-time Communication
- **ws**: WebSocket server for bidirectional real-time messaging

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string