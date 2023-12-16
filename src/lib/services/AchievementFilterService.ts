import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

export default class AchievementFilterService {
	constructor() {
		this.initializeMessageBus();
	}

	private initializeMessageBus() {
		let lastMessage = this.getLastMessage();

		if (lastMessage === null || lastMessage === undefined)
			MessageBus.sendMessage(Messages.FilterGamesWithAchievements, true);
	}

	private getLastMessage() {
		return MessageBus.getLastMessage<boolean>(Messages.FilterGamesWithAchievements);
	}

	toggleFilter() {
		let lastMessage = this.getLastMessage();

		MessageBus.sendMessage(Messages.FilterGamesWithAchievements, !lastMessage);
	}

	getQueryStringValue() {
		let lastMessage = this.getLastMessage();

		let fValue = lastMessage ? '1' : '0';

		return `f=${fValue}`;
	}
}
