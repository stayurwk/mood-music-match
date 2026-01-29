# MoodTunes - AI Music Recommendation App

## Overview

MoodTunes is an AI-powered music discovery application that recommends songs, artists, and genres based on user-described moods. Users input how they're feeling, and the app uses OpenAI's GPT model to generate personalized music recommendations. The application stores mood history in a PostgreSQL database for future reference.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and mutations
- **Styling**: Tailwind CSS with custom dark theme, CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for page transitions and card animations
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Framework**: Express.js 5 with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Pattern**: REST endpoints defined in shared/routes.ts with Zod validation
- **Development**: Vite dev server proxied through Express for HMR support
- **Production**: esbuild bundles server code, Vite builds static client assets

### Data Storage
- **Database**: PostgreSQL via node-postgres (pg) driver
- **ORM**: Drizzle ORM with drizzle-zod for schema-to-validation integration
- **Schema Location**: shared/schema.ts (shared between client and server)
- **Migrations**: drizzle-kit with migrations output to ./migrations folder

### API Structure
- `POST /api/recommend` - Submit mood, receive AI-generated recommendations
- `GET /api/history` - Retrieve past mood searches with recommendations
- `GET /api/preview` - Get music preview URLs (Spotify integration planned)

### AI Integration
- **Provider**: OpenAI via Replit AI Integrations
- **Model**: GPT-5.2 for recommendation generation
- **Response Format**: Structured JSON with typed recommendations (song/artist/genre)
- **Environment Variables**: AI_INTEGRATIONS_OPENAI_API_KEY, AI_INTEGRATIONS_OPENAI_BASE_URL

### Shared Code Pattern
The `shared/` directory contains code used by both client and server:
- `schema.ts` - Database schema and Zod types
- `routes.ts` - API route definitions with input/output validation
- `models/` - Additional data models (chat conversations/messages)

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via DATABASE_URL environment variable
- **connect-pg-simple**: Session storage for PostgreSQL (available but sessions not currently implemented)

### AI Services
- **OpenAI API**: Music recommendation generation via Replit AI Integrations proxy
- Additional AI capabilities available in `server/replit_integrations/`:
  - Audio: Voice chat, speech-to-text, text-to-speech
  - Image: Image generation and editing
  - Chat: Conversation management with streaming
  - Batch: Rate-limited batch processing utilities

### Frontend Libraries
- **Radix UI**: Accessible component primitives (dialogs, menus, toasts, etc.)
- **Lucide React**: Icon library
- **date-fns**: Date formatting utilities
- **class-variance-authority**: Component variant management

### Build & Development
- **Vite**: Frontend bundling with React plugin
- **esbuild**: Server-side bundling for production
- **Tailwind CSS**: Utility-first CSS with custom configuration
- **TypeScript**: Full type safety across client/server/shared code