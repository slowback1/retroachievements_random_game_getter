import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import type { Game } from '$lib/api/api';

export default class AchievementFilterService {
	constructor() {
		this.initializeMessageBus();
	}

	private initializeMessageBus() {
		let lastAchievementMessage = this.getLastAchievementFilterMessage();
		let lastHomebrewMessage = this.getLastHomebrewFilterMessage();

		if (lastAchievementMessage === null || lastAchievementMessage === undefined)
			MessageBus.sendMessage(Messages.FilterGamesWithAchievements, true);
		if (lastHomebrewMessage === null || lastHomebrewMessage === undefined)
			MessageBus.sendMessage(Messages.FilterHomebrewGames, true);
	}

	private getLastAchievementFilterMessage() {
		return MessageBus.getLastMessage<boolean>(Messages.FilterGamesWithAchievements);
	}

	private getLastHomebrewFilterMessage() {
		return MessageBus.getLastMessage<boolean>(Messages.FilterHomebrewGames);
	}

	toggleAchievementFilter() {
		let lastMessage = this.getLastAchievementFilterMessage();

		MessageBus.sendMessage(Messages.FilterGamesWithAchievements, !lastMessage);
	}

	toggleHomebrewFilter() {
		let lastMessage = this.getLastHomebrewFilterMessage();

		MessageBus.sendMessage(Messages.FilterHomebrewGames, !lastMessage);
	}

	getQueryStringValue() {
		let lastMessage = this.getLastAchievementFilterMessage();

		let fValue = lastMessage ? '1' : '0';

		return `f=${fValue}`;
	}

	getFilteredList(gameList: Game[]) {
		let skipFilteringByHomebrew = this.getLastHomebrewFilterMessage() == false;

		if (skipFilteringByHomebrew) return gameList;

		return gameList.filter((game) => {
			let title = game.Title;

			const isHack = title.toLowerCase().includes('~hack~');
			const isHomebrew = title.toLowerCase().includes('~homebrew~');
			const isUnlicensed = title.toLowerCase().includes('~unlicensed~');
			const isPrototype = title.toLowerCase().includes('~prototype~');

			return !isHack && !isHomebrew && !isUnlicensed && !isPrototype;
		});
	}
}
