# FlowMindAI - Enterprise Workplace Automation Platform

## Overview

FlowMindAI is a comprehensive enterprise workplace automation platform designed to streamline internal processes through AI-powered Q&A, helpdesk ticket management, and workflow automation. The system serves as an intelligent assistant for HR, IT, and general employee queries while providing administrative tools for managing documents, users, and approval workflows.

## Features

### 🤖 AI-Powered Assistance
- Intelligent Q&A system using OpenAI GPT models
- Document processing and semantic search
- AI-suggested replies for tickets with multiple tones (professional, empathetic, technical)
- Proactive AI actions with intent recognition

### 🎫 Helpdesk Management
- Comprehensive ticket system with priority levels and SLA tracking
- Automated ticket routing based on content and departments
- Real-time status updates and notifications

### 📋 Workflow Automation
- Approval processes for leave requests, expenses, and access permissions
- Customizable workflow templates
- Email notifications for workflow status changes

### 👥 User Management
- Role-based access control (admin, hr, it, manager, employee)
- Department-based content access
- User profile management with secure authentication

### 📊 Reporting & Analytics
- Customizable reports with PDF/CSV export
- Ticket volume and response time analytics
- Department performance metrics
- Workflow completion tracking

### 🔧 Administrative Tools
- Document management with version control
- FAQ generation from Q&A history
- Integration management (Slack, email services)
- System settings and configuration

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for state management
- **Wouter** for routing
- **Uppy** for file uploads

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** with PostgreSQL
- **OpenAI API** integration
- **WebSocket** for real-time updates
- **SendGrid/Resend** for email notifications
- **Bcrypt** for password security

### Database & Storage
- **PostgreSQL** (Neon serverless)
- **Google Cloud Storage** for file storage
- **Vector embeddings** for semantic search

## Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key
- Email service API key (SendGrid or Resend)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/tebriz993/FlowMindAI.git
cd FlowMindAI
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment variables**
Create a `.env` file with:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/flowmindai"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Email Service
RESEND_API_KEY="your-resend-api-key"
# or
SENDGRID_API_KEY="your-sendgrid-api-key"

# Object Storage (if using)
DEFAULT_OBJECT_STORAGE_BUCKET_ID="your-bucket-id"
PUBLIC_OBJECT_SEARCH_PATHS="your-search-paths"
PRIVATE_OBJECT_DIR="your-private-dir"

# Session Secret
SESSION_SECRET="your-secure-session-secret"
```

4. **Database setup**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
FlowMindAI/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Backend Express application
│   ├── services/          # Business logic services
│   ├── db.ts             # Database configuration
│   └── routes.ts         # API routes
├── shared/               # Shared types and schemas
│   └── schema.ts        # Database schema definitions
└── uploads/             # File upload directory
```

## Usage

### For Administrators
1. Access the admin dashboard at `/dashboard`
2. Manage users, departments, and system settings
3. Monitor tickets, workflows, and generate reports
4. Configure AI routing rules and integrations

### For Employees
1. Use the marketing website to learn about features
2. Submit tickets through the helpdesk system
3. Request approvals through workflow forms
4. Ask questions using the AI-powered Q&A system

## API Endpoints

### Authentication
- `POST /api/auth/register-complete` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/change-password` - Change password

### Tickets
- `GET /api/tickets` - List tickets
- `POST /api/tickets` - Create ticket
- `PATCH /api/tickets/:id` - Update ticket
- `GET /api/tickets/:id/suggested-replies` - Get AI suggestions

### Workflows
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `PATCH /api/workflows/:id` - Update workflow status

### Documents & Q&A
- `POST /api/qa` - Ask question
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document

## Deployment

### Replit Deployment (Recommended)
1. Push code to Replit
2. Configure environment variables in Secrets
3. Use Replit's deployment feature
4. Get automatic `.replit.app` domain

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy to your preferred hosting platform
3. Configure environment variables
4. Set up PostgreSQL database
5. Configure SSL and domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software developed by Crocusoft MMC.

## Support

For support and questions:
- Email: tabrizl@crocusoft.com

---

**FlowMindAI** - Transform your workplace with intelligent automation
