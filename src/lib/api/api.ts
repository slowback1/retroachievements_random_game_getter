import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

export type Game = {
	Title: string;
	ConsoleName: string;
	ID: number;
};

export default class API {
	private static base_url = 'https://retroachievements.org/API';

	private buildUrl(url: string, payload: string) {
		let apiKey = MessageBus.getLastMessage(Messages.RetroAchievementsApiKey);
		let user = MessageBus.getLastMessage(Messages.RetroAchievementsUser);

		return `${API.base_url}/${url}?z=${user}&y=${apiKey}&${payload}`;
	}

	async getGameListForConsole(consoleId: string | number): Promise<Game[]> {
		let url = this.buildUrl('API_GetGameList.php', `i=${consoleId}&f=1`);

		return await fetch(url).then((res) => res.json());
	}
}
