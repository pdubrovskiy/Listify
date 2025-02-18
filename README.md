# Listify 📝

A modern, full-stack todo application built with Go Fiber and React, featuring a clean UI and real-time updates.


## 🔗 Links

The original source code can be found on [Bitbucket](https://bitbucket.org/pdubrovskiyit/listify/src/main/).

[![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-319795?style=for-the-badge&logo=chakra-ui&logoColor=white)](https://chakra-ui.com/)

## ✨ Features

- 🚀 High-performance Go Fiber backend
- 💻 Modern React frontend with TypeScript
- 🎨 Beautiful and responsive UI with Chakra UI
- 📦 MongoDB for reliable data storage
- 🔄 Real-time todo management
- 🧪 Backend unit tests
- 🔥 Hot reload development environment
- 🐳 Containerized with Docker
- 🚢 CI/CD pipeline with Bitbucket Pipelines
- ☁️ Cloud Run deployment ready
- 🔒 Secure configuration management
- 🪝 Git hooks for code quality

## 🛠️ Tech Stack

### Backend
- **Language**: Go (1.21)
- **Framework**: Fiber v2
- **Database**: MongoDB
- **Environment**: godotenv
- **Testing**: Go testing package with testify
- **Hot Reload**: Air

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **UI Library**: Chakra UI
- **Build Tool**: Vite
- **State Management**: React Query
- **Icons**: React Icons
- **Testing**: Vitest with JSDOM
- **Linting**: ESLint with TypeScript support

### DevOps & Infrastructure
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: Bitbucket Pipelines
- **Cloud Platform**: Google Cloud Run
- **Web Server**: Nginx (frontend)
- **Container Registry**: Google Artifact Registry
- **Version Control**: Git with pre-commit/pre-push hooks
- **Environment Management**: .env files with examples

### Development Tools
- **Code Quality**:
  - Go: `golangci-lint`, `go fmt`, `go vet`
  - TypeScript: ESLint, TypeScript compiler
- **Git Hooks**:
  - Pre-commit: Code formatting and linting
  - Pre-push: Test execution and coverage
- **API Testing**: Go test suite with testify
- **Hot Reload**: 
  - Backend: Air for Go
  - Frontend: Vite dev server

## 🚀 Getting Started

### Prerequisites

- Go (1.21 or higher)
- Node.js (v19 or higher)
- MongoDB
- Docker (for containerized deployment)
- Google Cloud SDK (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pdubrovskiy/listify.git
cd listify
```

2. Set up the backend:
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB connection string and other configurations
go mod download
go run main.go
```

3. Set up the frontend:
```bash
cd client
npm install
npm run dev
```

## 📁 Project Structure

```
listify/
├── server/                 # Go backend
│   ├── database/          # Database connection and interfaces
│   ├── handlers/          # Request handlers
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   └── main.go           # Entry point
├── client/                # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── features/     # Feature-specific components
│   │   └── App.tsx      # Main application component
│   └── package.json     # Frontend dependencies
└── README.md
```

## 🔧 Development

### Local Development
```bash
# Backend Development with hot reload
cd server
cp .env.example .env
go mod download
air

# Frontend Development
cd client
npm install
npm run dev
```

### Docker Development
```bash
# Build and run backend
cd server
docker build -t listify-backend .
docker run -p 8080:8080 --env-file .env listify-backend

# Build and run frontend
cd client
docker build -t listify-frontend .
docker run -p 80:8080 listify-frontend
```

### Cloud Deployment
```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy to Cloud Run
gcloud run deploy listify-backend --source ./server
gcloud run deploy listify-frontend --source ./client
```

## 🧪 Testing

### Backend Testing
```bash
cd server
go test ./... -v        # Run tests
go test -cover ./...    # Run tests with coverage
```

### Frontend Testing
```bash
cd client
npm run test           # Run tests
npm run test:coverage  # Run tests with coverage
```

### Linting
```bash
# Backend
cd server
go fmt ./...
go vet ./...
golangci-lint run

# Frontend
cd client
npm run lint
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
