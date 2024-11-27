# SKiddy V2

A modern course learning platform built with React Native, Expo, and Strapi.

## Features

- Course viewing and management
- Video lessons with player controls
- Responsive design for mobile and desktop
- Course resources and materials
- User authentication
- Admin dashboard for course management

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Strapi backend server

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the environment variables in `.env`:
```
NEXT_PUBLIC_STRAPI_API_URL=your-strapi-url
NEXT_PUBLIC_STRAPI_TOKEN=your-strapi-token
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

## Docker Deployment

1. Build the Docker image:
```bash
docker build -t skiddy-v2 .
```

2. Run the container:
```bash
docker run -p 3000:3000 --env-file .env skiddy-v2
```

## Deployment with Easypanel

1. Create a new service in Easypanel
2. Use the Dockerfile from this repository
3. Set the required environment variables
4. Deploy the service

## License

MIT
