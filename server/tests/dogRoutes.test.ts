import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const getDogImageMock = vi.fn();

vi.mock('../controllers/dogController', () => ({
	getDogImage: getDogImageMock
}));

describe('dogRoutes', () => {
	beforeEach(() => {
		getDogImageMock.mockReset();
	});

	it('GET /api/dogs/random returns 200, success true and mocked imageUrl', async () => {
		const mockedImageUrl = 'https://images.dog.ceo/breeds/stbernard/n0210925_15579.jpg';

		getDogImageMock.mockImplementation((_req, res) => {
			res.status(200).json({
				success: true,
				data: {
					imageUrl: mockedImageUrl,
					status: 'success'
				}
			});
		});

		const { default: dogRoutes } = await import('../routes/dogRoutes');
		const app = express();
		app.use('/api/dogs', dogRoutes);

		const response = await request(app).get('/api/dogs/random');

		expect(response.statusCode).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data.imageUrl).toContain(mockedImageUrl);
	});

	it('GET /api/dog/random returns 500 and error JSON', async () => {
		getDogImageMock.mockImplementation((_req, res) => {
			res.status(500).json({
				success: false,
				error: 'Failed to fetch dog image: Network error'
			});
		});

		const { default: dogRoutes } = await import('../routes/dogRoutes');
		const app = express();
		app.use('/api/dog', dogRoutes);

		const response = await request(app).get('/api/dog/random');

		expect(response.statusCode).toBe(500);
		expect(response.body.error).toBeDefined();
	});
});
