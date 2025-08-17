# SecondChance Matrimony

## Overview

SecondChance Matrimony is a modern matrimony platform specifically designed for divorced individuals seeking meaningful connections. The application combines a comprehensive user-matching system with integrated event management services, built on principles of trust, privacy, and celebrating new beginnings. The platform features user profiles with detailed information, smart matching algorithms, like/match functionality, messaging capabilities, and event vendor services for wedding planning.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS styling
- **State Management**: TanStack React Query for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture with centralized route handling
- **Middleware**: Custom logging middleware for API requests and responses
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Authentication & Authorization
- **Authentication Provider**: Replit Auth using OpenID Connect (OIDC)
- **Session Management**: Express sessions with PostgreSQL session store
- **Security**: HTTP-only secure cookies with configurable TTL
- **User Context**: Passport.js integration for authentication strategies

### Database & Data Layer
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with type-safe schema definitions and migrations
- **Schema Design**: Relational data model with users, profiles, likes, matches, messages, and event vendors
- **Data Access**: Repository pattern implementation with centralized storage interface
- **Connection Pooling**: Neon serverless connection pooling with WebSocket support

### Key Features Implementation
- **Profile Management**: Comprehensive user profiles with personal information, preferences, and verification status
- **Matching System**: Like-based matching with mutual like detection and automatic match creation
- **Messaging**: Real-time messaging system between matched users
- **Event Services**: Integrated event vendor directory with categorized services (wedding halls, catering, photography, etc.)
- **Search & Filtering**: Advanced profile filtering by age, location, profession, and verification status

### Development & Deployment
- **Build System**: Vite for frontend bundling with esbuild for server-side compilation
- **Development Tools**: Hot module replacement, TypeScript checking, and runtime error overlays
- **Asset Management**: Static asset serving with proper caching strategies
- **Environment Configuration**: Environment-specific configuration with proper secret management

### Security Considerations
- **Data Privacy**: Secure handling of personal information with proper access controls
- **Session Security**: Secure session management with proper expiration and cleanup
- **Input Validation**: Comprehensive input validation using Zod schemas
- **CORS & Security Headers**: Proper CORS configuration and security headers implementation

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling and WebSocket support
- **Replit Auth**: Complete authentication solution with OIDC integration for user management and session handling

### Development & Runtime
- **Replit Platform**: Development environment with integrated deployment and runtime features
- **Node.js Ecosystem**: Express.js web framework, TypeScript compiler, and related tooling

### UI & Frontend Libraries
- **Radix UI**: Headless UI components for accessibility-compliant interactive elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design and theming
- **Lucide React**: Icon library for consistent iconography throughout the application

### Development Tools
- **Vite Plugins**: Development server enhancement with error overlays and debugging tools
- **PostCSS**: CSS processing with Tailwind CSS integration and autoprefixer support

### External Resources
- **Google Fonts**: Poppins and Montserrat font families for typography
- **Font Awesome**: Icon library for additional UI elements
- **Unsplash**: Stock photography service for event service placeholder images