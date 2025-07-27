EduBot - Automated Response System
Overview
EduBot is a full-stack educational support system that provides automated response capabilities for handling student inquiries. The application features a modern React frontend with shadcn/ui components, a Node.js/Express backend, and PostgreSQL database integration using Drizzle ORM. The system includes intelligent response matching, analytics dashboard, and comprehensive inquiry management.

User Preferences
Preferred communication style: Simple, everyday language.

System Architecture
Frontend Architecture
Framework: React 18 with TypeScript
Build Tool: Vite for fast development and optimized builds
UI Library: shadcn/ui components built on Radix UI primitives
Styling: TailwindCSS with CSS custom properties for theming
State Management: React Query (TanStack Query) for server state
Routing: Wouter for lightweight client-side routing
Form Handling: React Hook Form with Zod validation
Backend Architecture
Runtime: Node.js with TypeScript
Framework: Express.js for HTTP server and API routes
Database ORM: Drizzle ORM for type-safe database operations
Database: PostgreSQL (configured for Neon serverless)
Build System: ESBuild for production builds
Development: tsx for TypeScript execution
Project Structure
├── client/          # Frontend React application
├── server/          # Backend Express server
├── shared/          # Shared TypeScript types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
Key Components
Database Schema
The system uses four main entities:

Categories: Organize response templates by topic/subject
Response Templates: Predefined responses with keywords for matching
Inquiries: Student questions and their automated/manual responses
Analytics: Performance metrics and usage statistics
API Endpoints
Categories Management: CRUD operations for organizing templates
Response Templates: Full management of automated response content
Inquiries: Handling incoming messages and response generation
Analytics: Dashboard metrics and performance tracking
Frontend Pages
Dashboard: Analytics overview with metrics cards and charts
Live Chat: Real-time inquiry management interface
Knowledge Base: Response template management
Categories: Template organization system
Intelligent Response Matching
The system includes NLP-style utilities for matching student inquiries to appropriate response templates based on:

Keyword matching with weighted scoring
Title and content similarity analysis
Confidence threshold filtering
Usage analytics for template optimization
Data Flow
Inquiry Processing
Student submits inquiry through chat interface
System analyzes message content using NLP utilities
Matches against active response templates
Generates automated response or flags for manual review
Records analytics data for performance tracking
Template Management
Administrators create/edit response templates
Templates are categorized and tagged with keywords
System tracks usage patterns and success rates
Analytics inform template optimization decisions
Real-time Updates
Chat interface refreshes every 5 seconds for live updates
React Query handles cache invalidation and background refetching
Toast notifications provide user feedback for actions
External Dependencies
Core Dependencies
@neondatabase/serverless: PostgreSQL serverless driver
drizzle-orm: Type-safe database operations
@tanstack/react-query: Server state management
@radix-ui/*: Headless UI component primitives
recharts: Data visualization for analytics
Development Tools
drizzle-kit: Database schema management and migrations
@replit/vite-plugin-*: Replit-specific development tools
tailwindcss: Utility-first CSS framework
Authentication & Sessions
connect-pg-simple: PostgreSQL session store (configured but not actively used)
Deployment Strategy
Development
Vite dev server with HMR for frontend
tsx for TypeScript execution in development
Replit-specific plugins for development environment integration
Production Build
Frontend: Vite builds optimized static assets to dist/public
Backend: ESBuild compiles TypeScript server to dist/index.js
Database: Drizzle Kit manages schema migrations
Environment Configuration
DATABASE_URL: PostgreSQL connection string (required)
NODE_ENV: Environment mode (development/production)
REPL_ID: Replit environment detection
Database Setup
The system uses Drizzle ORM with PostgreSQL and includes:

Auto-generated UUIDs for primary keys
Timestamp tracking for created/updated records
Array fields for keywords storage
Real number fields for analytics metrics
The application follows a monorepo structure with clear separation between client, server, and shared code, making it maintainable and scalable for educational institution deployments.
