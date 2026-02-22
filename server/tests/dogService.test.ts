import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getRandomDogImage } from '../services/dogService';

describe('getRandomDogImage', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('returns imageUrl from message, success status, and calls fetch once', async () => {
		const mockedApiData = {
			message: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
			status: 'success'
		};

		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
			status: 200,
			json: vi.fn().mockResolvedValue(mockedApiData)
		} as unknown as Response);

		const result = await getRandomDogImage();

		expect(result.imageUrl).toBe('https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg');
		expect(result.status).toBe('success');
		expect(fetchMock).toHaveBeenCalledOnce();
	});

	it('rejects and throws expected error when API response is not ok', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: false,
			status: 500
		} as unknown as Response);

		await expect(getRandomDogImage()).rejects.toThrow(
			'Failed to fetch dog image: Dog API returned status 500'
		);
	});
});
