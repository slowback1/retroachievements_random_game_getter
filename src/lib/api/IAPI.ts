import type { Game, GameConsole } from '$lib/api/api';

export interface IAPI {
	getGameListForConsole(consoleId: string | number): Promise<Game[]>;

	GetConsoles(): Promise<GameConsole[]>;
}
