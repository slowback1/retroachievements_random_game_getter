import AchievementFilterService from '$lib/services/AchievementFilterService';
import { beforeEach } from 'vitest';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import type { Game } from '$lib/api/api';

describe('AchievementFilterService', () => {
	let service: AchievementFilterService;

	beforeEach(() => {
		MessageBus.clearAll();

		service = new AchievementFilterService();
	});

	it("initializes the message bus with a default value for filtering out games that don't have achievements", () => {
		let lastMessage = MessageBus.getLastMessage<boolean>(Messages.FilterGamesWithAchievements);

		expect(lastMessage).toEqual(true);
	});

	it('initializes the message bus with a default value for filtering out games that are homebrew', () => {
		let lastMessage = MessageBus.getLastMessage<boolean>(Messages.FilterHomebrewGames);

		expect(lastMessage).toEqual(true);
	});

	it.each([Messages.FilterGamesWithAchievements, Messages.FilterHomebrewGames])(
		'does not overwrite the existing message bus value if it exists',
		(message) => {
			MessageBus.sendMessage(message, false);

			service = new AchievementFilterService();

			let lastMessage = MessageBus.getLastMessage<boolean>(message);

			expect(lastMessage).toEqual(false);
		}
	);

	it('can toggle the filter off', () => {
		service.toggleAchievementFilter();

		let lastMessage = MessageBus.getLastMessage<boolean>(Messages.FilterGamesWithAchievements);

		expect(lastMessage).toEqual(false);
	});

	it('can toggle the homebrew filter off', () => {
		service.toggleHomebrewFilter();

		let lastMessage = MessageBus.getLastMessage<boolean>(Messages.FilterHomebrewGames);

		expect(lastMessage).toEqual(false);
	});

	it('toggling the filter twice turns the filter back on', () => {
		service.toggleAchievementFilter();
		service.toggleAchievementFilter();
		let lastMessage = MessageBus.getLastMessage<boolean>(Messages.FilterGamesWithAchievements);

		expect(lastMessage).toEqual(true);
	});

	it('toggling the homebrew filter twice turns the filter back on', () => {
		service.toggleHomebrewFilter();
		service.toggleHomebrewFilter();

		let lastMessage = MessageBus.getLastMessage<boolean>(Messages.FilterHomebrewGames);

		expect(lastMessage).toEqual(true);
	});

	it.each([
		[true, '1'],
		[false, '0']
	])(
		'can build out the query string parameter to send to the retroacheivements api when the value is %s',
		(value, expectedFValue) => {
			MessageBus.sendMessage(Messages.FilterGamesWithAchievements, value);

			let result = service.getQueryStringValue();

			expect(result).toEqual(`f=${expectedFValue}`);
		}
	);

	it.each([
		['Super Mario Bros.', 1],
		['~Hack~ Mega Man 0X', 0],
		['~Homebrew~ Final Fantasy 2.5 HD', 0],
		['~Unlicensed~ Mario goes to Pizza Hut', 0],
		["~Prototype~ Luigi's Mean Green Machine", 0],
		['.HACK', 1],
		['Homebrewing alone', 1],
		["Sonic's Officially Unlicensed Detective Adventure", 1]
	])(
		"when the title is %s, and it is the only game in the list, and homebrew filtering is turned on, the filtered list's length is %s",
		(title, expectedFilteredLength) => {
			let gameList: Game[] = [
				{
					ID: 1,
					Title: title,
					ConsoleName: 'NES'
				}
			];

			let filteredList = service.getFilteredList(gameList);
			expect(filteredList.length).toEqual(expectedFilteredLength);
		}
	);

	it.each([
		['Super Mario Bros.'],
		['~Hack~ Mega Man 0X'],
		['~Homebrew~ Final Fantasy 2.5 HD'],
		['~Unlicensed~ Mario goes to Pizza Hut'],
		["~Prototype~ Luigi's Mean Green Machine"],
		['.HACK'],
		['Homebrewing alone'],
		["Sonic's Officially Unlicensed Detective Adventure"]
	])(
		'does not try to filter out any games when the title is %s and homebrew filtering is turned off',
		(title) => {
			let gameList: Game[] = [
				{
					ID: 1,
					Title: title,
					ConsoleName: 'NES'
				}
			];

			MessageBus.sendMessage(Messages.FilterHomebrewGames, false);

			let result = service.getFilteredList(gameList);

			expect(result.length).toEqual(1);
		}
	);
});
