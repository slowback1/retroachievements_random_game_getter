import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import AchievementFilterService from '$lib/services/AchievementFilterService';
import type { IAPI } from '$lib/api/IAPI';

export type Game = {
	Title: string;
	ConsoleName: string;
	ID: number;
};

export type GameConsole = {
	ID: number;
	Name: string;
};

export default class API implements IAPI {
	private static base_url = 'https://retroachievements.org/API';

	buildUrl(url: string, payload?: string) {
		let apiKey = MessageBus.getLastMessage(Messages.RetroAchievementsApiKey);
		let user = MessageBus.getLastMessage(Messages.RetroAchievementsUser);

		let combinedUrl = `${API.base_url}/${url}?z=${user}&y=${apiKey}`;

		if (payload) combinedUrl = `${combinedUrl}&${payload}`;

		return combinedUrl;
	}

	static hasCredentials() {
		let apiKey = MessageBus.getLastMessage(Messages.RetroAchievementsApiKey);
		let user = MessageBus.getLastMessage(Messages.RetroAchievementsUser);

		return !!apiKey && !!user;
	}

	async getGameListForConsole(consoleId: string | number): Promise<Game[]> {
		let filterValue = new AchievementFilterService().getQueryStringValue();
		let url = this.buildUrl('API_GetGameList.php', `i=${consoleId}&${filterValue}`);

		return await fetch(url).then((res) => res.json());
	}

	async GetConsoles(): Promise<GameConsole[]> {
		let url = this.buildUrl(`API_GetConsoleIDs.php`);

		return await fetch(url).then((res) => res.json());
	}
}
