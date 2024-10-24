# Server Dashboard

A comprehensive monitoring and documentation dashboard for server management, built with React and Node.js. This monorepo project provides a centralized interface for monitoring system resources, managing Docker services, and maintaining server documentation.

## Features

- 🖥️ **System Monitoring**: Real-time tracking of CPU, memory, and disk usage
- 🐳 **Docker Integration**: Container management and statistics
- 🌐 **Network Overview**: Network status and configuration management
- 📊 **Service Health**: Status monitoring of critical services
- 📚 **Documentation**: Integrated system documentation
- 🎨 **Modern UI**: Clean, responsive interface built with shadcn/ui
- 🔄 **Real-time Updates**: Automatic data refresh using React Query

## Tech Stack

### Frontend
- React 18.3 with TypeScript
- Vite for building
- TanStack Query (React Query) for data management
- shadcn/ui components
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript
- Docker API integration
- System monitoring services

## Prerequisites

Before you begin, ensure you have installed:
- Node.js 18+
- pnpm 8+
- Docker (for running services)

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd server-dashboard
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development servers:
```bash
pnpm dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Project Structure

```
server-dashboard/
├── apps/
│   ├── frontend/         # React dashboard UI
│   └── backend/          # Express API server
├── packages/
│   └── types/           # Shared TypeScript types
├── tsconfig/            # TypeScript configurations
├── pnpm-workspace.yaml  # Workspace definition
└── package.json        # Root package.json
```

## Available Scripts

- `pnpm dev` - Start all packages in development mode
- `pnpm build` - Build all packages
- `pnpm lint` - Run ESLint on all packages
- `pnpm test` - Run tests (when implemented)

## Development

### Environment Variables

Frontend (`.env`):
```
VITE_API_BASE_URL=http://localhost:3000
```

Backend (`.env`):
```
PORT=3000
```

### Adding New Components

The project uses shadcn/ui components. To add a new component:

```bash
pnpm dlx @shadcn/ui@latest add component-name
```

### Code Style

- TypeScript with strict mode enabled
- ESLint + Prettier for code formatting
- Tailwind CSS for styling
- Feature-based folder structure

## API Endpoints

### System Information
- `GET /api/system` - Get system information (OS, CPU, RAM)
- `GET /api/docker/stats` - Get Docker statistics
- `GET /api/network` - Get network information
- `GET /api/services/status` - Get service status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

Testing infrastructure is set up with Vitest for the frontend. Run tests with:

```bash
pnpm test
```

## Future Enhancements

- [ ] Real-time updates using WebSocket
- [ ] User authentication and authorization
- [ ] Monitoring alerts and notifications
- [ ] Dark mode support
- [ ] Mobile responsiveness improvements
- [ ] End-to-end testing
- [ ] Deployment pipeline
- [ ] Service logs viewer
- [ ] Custom metrics dashboard

## License

This project is licensed under the MIT License - see the LICENSE file for details.