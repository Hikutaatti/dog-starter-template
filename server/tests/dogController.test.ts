import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { getDogImage } from '../controllers/dogController';
import * as dogService from '../services/dogService';

describe('getDogImage controller', () => {
	it('returns JSON with success true and mocked JSON from service', async () => {
		const mockedServiceData = {
			imageUrl: 'https://images.dog.ceo/breeds/terrier-welsh/lucy.jpg',
			status: 'success'
		};

		vi.spyOn(dogService, 'getRandomDogImage').mockResolvedValue(mockedServiceData);

		const req = {} as Request;
		const json = vi.fn();
		const status = vi.fn().mockReturnValue({ json });
		const res = { json, status } as unknown as Response;

		await getDogImage(req, res);

		expect(json).toHaveBeenCalledWith({
			success: true,
			data: mockedServiceData
		});
	});
});
