# Dog Breeds Explorer

A full-stack application for browsing dog breeds using Vue 3 and Node.js with TypeScript, integrated with the Dog CEO API.

## Features

- Browse all available dog breeds
- View random images for each breed
- Mark breeds as favorites
- Search functionality across all breeds
- Persistent favorites storage

## Tech Stack

**Backend:** Node.js, TypeScript, Express  
**Frontend:** Vue 3, TypeScript, Pinia, Vue Router, Tailwind CSS  
**API:** Dog CEO API

## Quick Start

### Prerequisites

- Node.js (v16+)
- npm

### Installation

```bash
# Clone repository
git clone <repository-url>
cd fullstack-vue-node-challenge

# Install dependencies
npm run install:all
```

### Run Development Server

```bash
# Start both backend and frontend
npm run dev

# Or use the helper script
./start-dev.sh
```

Servers will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Build for Production

```bash
npm run build
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/breeds` | Get all dog breeds |
| GET | `/api/breeds/:breed/images` | Get 3 random images |
| GET | `/api/favorites` | Get favorite breeds |
| POST | `/api/favorites` | Add breed to favorites |
| DELETE | `/api/favorites/:breed` | Remove from favorites |

## Project Structure

```
├── backend/           # Node.js + TypeScript API
│   └── src/
│       └── index.ts   # Main server file
├── frontend/          # Vue 3 + TypeScript SPA
│   └── src/
│       ├── views/     # Page components
│       └── stores/    # Pinia state management
└── README.md
```

## Docker Support

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Known Issues & Assumptions

- Favorites are stored in a JSON file (`backend/favorites.json`) for simplicity. In production, consider using a proper database.
- The application fetches 3 random images per breed from the Dog CEO API.
- Some images from the external API may occasionally fail to load; the app handles this gracefully with fallback images.
- Sub-breeds are handled by splitting on `-` (e.g., `bulldog-french` becomes `bulldog/french` in the API call).
- CORS is currently configured for development (`localhost:3000`). Update for production deployment.

## License

MIT