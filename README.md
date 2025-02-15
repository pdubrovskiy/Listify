# Listify 📝

A modern, full-stack todo application built with Go Fiber and React, featuring a clean UI and real-time updates.

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
- 🌐 Cross-origin resource sharing (CORS) enabled
- 🧪 Backend unit tests
- 🔥 Hot reload development environment

## 🛠️ Tech Stack

### Backend
- **Language**: Go
- **Framework**: Fiber v2
- **Database**: MongoDB
- **Environment**: godotenv
- **Testing**: Go testing package with testify

### Frontend
- **Framework**: React
- **Language**: TypeScript
- **UI Library**: Chakra UI
- **Build Tool**: Vite
- **State Management**: React Query
- **Icons**: React Icons

## 🚀 Getting Started

### Prerequisites

- Go (1.23.2 or higher)
- Node.js (v19 or higher)
- MongoDB

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

### Backend Development
```bash
cd server
go run main.go
```
The server will start on `http://localhost:4000`

### Frontend Development
```bash
cd client
npm run dev
```
The development server will start on `http://localhost:5173`

## 🧪 Testing

To run backend tests:
```bash
cd server
go test ./...
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

The original source code can be found on [Bitbucket](https://bitbucket.org/pdubrovskiyit/listify/src/main/).