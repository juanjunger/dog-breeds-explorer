import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

describe('Dog Breeds API', () => {
  beforeAll(async () => {
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test('Health check endpoint', async () => {
    const response = await axios.get(`${BASE_URL}/health`);
    expect(response.status).toBe(200);
    expect(response.data.status).toBe('OK');
  });

  test('Get all breeds', async () => {
    const response = await axios.get(`${BASE_URL}/api/breeds`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThan(0);
  });

  test('Get breed images', async () => {
    const response = await axios.get(`${BASE_URL}/api/breeds/bulldog/images`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBe(3);
  });

  test('Add and remove favorite', async () => {
    const breed = 'test-breed';
    
    // Add favorite
    const addResponse = await axios.post(`${BASE_URL}/api/favorites`, { breed });
    expect(addResponse.status).toBe(200);
    
    // Get favorites
    const getResponse = await axios.get(`${BASE_URL}/api/favorites`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.data).toContain(breed);
    
    // Remove favorite
    const removeResponse = await axios.delete(`${BASE_URL}/api/favorites/${breed}`);
    expect(removeResponse.status).toBe(200);
    
    // Verify removal
    const finalResponse = await axios.get(`${BASE_URL}/api/favorites`);
    expect(finalResponse.data).not.toContain(breed);
  });
});
