# IncidentHub - Incident Management System

A simple, clean incident management system built with Next.js, TypeScript, and PostgreSQL.

## Features

- **Dashboard** - Overview of all incidents with stats (total, open, investigating, critical)
- **Incident CRUD** - Create, view, update, and track incidents
- **Activity Timeline** - Track all changes and comments on incidents
- **User Authentication** - Secure login with email/password
- **Filtering** - Filter incidents by status, severity, and assignee

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js (Credentials)
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- npm or yarn

### Setup

1. **Start PostgreSQL with Docker**:
   ```bash
   docker-compose up -d
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

4. **Initialize the database**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open http://localhost:3000**

### Creating Your First User

You can register a new account at `/register` or use Prisma Studio to create a user directly:

```bash
npm run db:studio
```

## Project Structure

```
incident-system/
├── app/
│   ├── (auth)/           # Auth pages (login, register)
│   ├── (dashboard)/      # Main app pages
│   │   ├── incidents/    # Incident CRUD pages
│   │   └── page.tsx      # Dashboard
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Feature components
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   └── actions.ts        # Server actions
├── prisma/
│   └── schema.prisma     # Database schema
└── types/
    └── index.ts          # TypeScript types
```

## Deployment

### Docker

```bash
# Build the image
docker build -t incident-hub .

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  -e NEXTAUTH_URL="https://..." \
  incident-hub
```

### Google Cloud Run

1. Build and push to Artifact Registry:
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/incident-hub
   ```

2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy incident-hub \
     --image gcr.io/PROJECT_ID/incident-hub \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

3. Set up Cloud SQL PostgreSQL and connect via connection string.

## API Endpoints

- `POST /api/auth/register` - Register new user
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers
- `GET /api/incidents` - List incidents
- `POST /api/incidents` - Create incident
- `GET/PATCH /api/incidents/[id]` - Get/Update incident
- `POST /api/incidents/[id]/activities` - Add activity

## Database Schema

### User
- id, name, email, password, role, createdAt, updatedAt

### Incident
- id, title, description, severity, status, createdById, assignedToId, createdAt, updatedAt

### IncidentActivity
- id, action, message, incidentId, createdById, createdAt

## License

MIT
