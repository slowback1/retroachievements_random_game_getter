import type { IAPI } from '$lib/api/IAPI';
import type { Game, GameConsole } from '$lib/api/api';
import { consoleIds } from '$lib/api/consoleIds';

export const testGames: Game[] = [
	{
		Title: 'Super Mario Bros.',
		ID: 1,
		ConsoleName: 'NES'
	},
	{
		Title: 'The Legend of Zelda',
		ID: 2,
		ConsoleName: 'NES'
	}
];

export default class TestApi implements IAPI {
	GetConsoles(): Promise<GameConsole[]> {
		return Promise.resolve(consoleIds);
	}

	getGameListForConsole(consoleId: string | number): Promise<Game[]> {
		return Promise.resolve(testGames);
	}
}
