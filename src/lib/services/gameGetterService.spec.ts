import GameGetterService from '$lib/services/gameGetterService';
import TestApi from '$lib/api/testApi';

describe('GameGetterService', () => {
	it('can get a random game', async () => {
		let api = new TestApi();

		let service = new GameGetterService(api);

		let game = await service.getRandomGame(['1']);

		expect(game).not.toBeNull();
	});

	it('only calls the api once when getting a random game', async () => {
		let api = new TestApi();
		api.getGameListForConsole = vi.fn(async () => []);

		let service = new GameGetterService(api);

		let game = await service.getRandomGame(['1', '2', '3']);

		expect(api.getGameListForConsole).toHaveBeenCalledOnce();
	});
});
