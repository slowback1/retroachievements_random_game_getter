import AchievementFilterService from '$lib/services/AchievementFilterService';
import { beforeEach } from 'vitest';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

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

	it('does not overwrite the existing message bus value if it exists', () => {
		MessageBus.sendMessage(Messages.FilterGamesWithAchievements, false);

		service = new AchievementFilterService();

		let lastMessage = MessageBus.getLastMessage<boolean>(Messages.FilterGamesWithAchievements);

		expect(lastMessage).toEqual(false);
	});

	it('can toggle the filter off', () => {
		service.toggleFilter();

		let lastMessage = MessageBus.getLastMessage<boolean>(Messages.FilterGamesWithAchievements);

		expect(lastMessage).toEqual(false);
	});

	it('toggling the filter twice turns the filter back on', () => {
		service.toggleFilter();
		service.toggleFilter();
		let lastMessage = MessageBus.getLastMessage<boolean>(Messages.FilterGamesWithAchievements);

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
});
