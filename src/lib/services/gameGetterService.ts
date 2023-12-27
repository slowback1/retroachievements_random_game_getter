import type { Game } from '$lib/api/api';
import type { IAPI } from '$lib/api/IAPI';

export default class GameGetterService {
	constructor(private readonly api: IAPI) {}

	async getRandomGame(checkedConsoles: string[]) {
		let consoleToGet = this.getRandomOfList(checkedConsoles);
		let gameList: Game[] = await this.api.getGameListForConsole(consoleToGet);

		if (gameList.length === 0) return;

		return this.getRandomOfList(gameList);
	}

	private getRandomOfList<T>(list: T[]): T {
		let min = 0;
		let max = list.length;

		let index = Math.floor(Math.random() * max) + min;

		return list[index];
	}
}
