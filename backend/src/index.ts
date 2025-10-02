import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data store for favorites
const FAVORITES_FILE = join(__dirname, 'favorites.json');

interface FavoritesData {
  breeds: string[];
}

// Helper function to read favorites from file
function readFavorites(): string[] {
  try {
    if (existsSync(FAVORITES_FILE)) {
      const data = readFileSync(FAVORITES_FILE, 'utf8');
      const parsed: FavoritesData = JSON.parse(data);
      return parsed.breeds || [];
    }
  } catch (error) {
    console.error('Error reading favorites file:', error);
  }
  return [];
}

// Helper function to write favorites to file
function writeFavorites(breeds: string[]): void {
  try {
    const data: FavoritesData = { breeds };
    writeFileSync(FAVORITES_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing favorites file:', error);
  }
}

// API Routes

// GET /api/breeds - Get all dog breeds
app.get('/api/breeds', async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://dog.ceo/api/breeds/list/all');
    const breedsData = response.data.message;
    
    // Convert object to array of breed names
    const breeds: string[] = [];
    for (const breed in breedsData) {
      breeds.push(breed);
      // Add sub-breeds if they exist
      if (breedsData[breed].length > 0) {
        for (const subBreed of breedsData[breed]) {
          breeds.push(`${breed}-${subBreed}`);
        }
      }
    }
    
    res.json(breeds.sort());
  } catch (error) {
    console.error('Error fetching breeds:', error);
    res.status(500).json({ error: 'Failed to fetch dog breeds' });
  }
});

// GET /api/breeds/:breed/images - Get images for a breed
app.get('/api/breeds/:breed/images', async (req: Request, res: Response) => {
  try {
    const { breed } = req.params;
    
    // Handle sub-breeds (e.g., bulldog-french)
    const breedParts = breed.split('-');
    let apiUrl: string;
    
    if (breedParts.length === 2) {
      // Sub-breed
      apiUrl = `https://dog.ceo/api/breed/${breedParts[0]}/${breedParts[1]}/images/random/3`;
    } else {
      // Main breed
      apiUrl = `https://dog.ceo/api/breed/${breed}/images/random/3`;
    }
    
    const response = await axios.get(apiUrl);
    const images = response.data.message;
    
    res.json(images);
  } catch (error) {
    console.error('Error fetching breed images:', error);
    res.status(500).json({ error: 'Failed to fetch breed images' });
  }
});

// POST /api/favorites - Add favorite breed
app.post('/api/favorites', (req: Request, res: Response) => {
  try {
    const { breed } = req.body;
    
    if (!breed || typeof breed !== 'string') {
      return res.status(400).json({ error: 'Breed is required and must be a string' });
    }
    
    const favorites = readFavorites();
    
    if (!favorites.includes(breed)) {
      favorites.push(breed);
      writeFavorites(favorites);
    }
    
    res.json({ message: 'Breed added to favorites', breed });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite breed' });
  }
});

// GET /api/favorites - Get favorite breeds
app.get('/api/favorites', (req: Request, res: Response) => {
  try {
    const favorites = readFavorites();
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorite breeds' });
  }
});

// DELETE /api/favorites/:breed - Remove favorite breed
app.delete('/api/favorites/:breed', (req: Request, res: Response) => {
  try {
    const { breed } = req.params;
    const favorites = readFavorites();
    
    const index = favorites.indexOf(breed);
    if (index > -1) {
      favorites.splice(index, 1);
      writeFavorites(favorites);
      res.json({ message: 'Breed removed from favorites', breed });
    } else {
      res.status(404).json({ error: 'Breed not found in favorites' });
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite breed' });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
