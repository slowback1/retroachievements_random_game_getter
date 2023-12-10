import API, { type GameConsole } from '$lib/api/api';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import { consoleIds } from '$lib/api/consoleIds';

export default class ConsoleListService {
	private static IsFetchingPromise: Promise<GameConsole[]>;

	static initialize() {
		MessageBus.subscribe(
			Messages.RetroAchievementsUser,
			this.credentialsSubscriptionCallback.bind(this)
		);
		MessageBus.subscribe(
			Messages.RetroAchievementsApiKey,
			this.credentialsSubscriptionCallback.bind(this)
		);
	}

	private static credentialsSubscriptionCallback() {
		if (API.hasCredentials()) this.fetchUpdatedConsoleList();
		else this.addHardCodedConsoleList();
	}

	private static addHardCodedConsoleList() {
		MessageBus.sendMessage(Messages.ConsoleList, consoleIds);
	}

	private static async fetchUpdatedConsoleList() {
		if (ConsoleListService.IsFetchingPromise) return;

		let api = new API();

		ConsoleListService.IsFetchingPromise = api.GetConsoles();

		let results = await ConsoleListService.IsFetchingPromise;

		MessageBus.sendMessage(Messages.ConsoleList, results);

		ConsoleListService.IsFetchingPromise = undefined;
	}
}
