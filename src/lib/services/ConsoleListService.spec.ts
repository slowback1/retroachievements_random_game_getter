import ConsoleListService from '$lib/services/ConsoleListService';
import { beforeEach, type Mock } from 'vitest';
import mockFetch from '$lib/utils/mockFetch';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';
import { waitFor } from '@testing-library/svelte';
import type { GameConsole } from '$lib/api/api';
import { consoleIds } from '$lib/api/consoleIds';

describe('ConsoleListService', () => {
	let mockedFetch: Mock;

	beforeEach(() => {
		MessageBus.clearAll();
		mockedFetch = mockFetch([{ ID: 1, Name: 'NES' }]);
	});

	describe('when the user does not have credentials', () => {
		beforeEach(() => {
			ConsoleListService.initialize();
		});

		it('does not call fetch', async () => {
			await new Promise((res) => setTimeout(res, 100));

			await waitFor(() => {
				expect(mockedFetch).not.toHaveBeenCalled();
			});
		});

		it('eventually calls fetch when credentials are filled out', async () => {
			MessageBus.sendMessage(Messages.RetroAchievementsUser, 'user');
			MessageBus.sendMessage(Messages.RetroAchievementsApiKey, 'api-key');

			await waitFor(() => {
				expect(mockedFetch).toHaveBeenCalled();
			});
		});

		it('stubs in the console list with a hardcoded list while waiting for the user to enter their credentials', async () => {
			await waitFor(() => {
				let consoleList = MessageBus.getLastMessage<GameConsole[]>(Messages.ConsoleList);

				expect(consoleList).toEqual(consoleIds);
			});
		});
	});

	describe('when the user has credentials', () => {
		beforeEach(() => {
			MessageBus.sendMessage(Messages.RetroAchievementsUser, 'user');
			MessageBus.sendMessage(Messages.RetroAchievementsApiKey, 'api-key');

			ConsoleListService.initialize();
		});

		it('calls fetch exactly once', async () => {
			await waitFor(() => {
				expect(mockedFetch).toHaveBeenCalledTimes(1);
			});
		});

		it('populates the message bus with the retrieved console list', async () => {
			await waitFor(() => {
				let consoleList = MessageBus.getLastMessage<GameConsole[]>(Messages.ConsoleList);

				expect(consoleList).toEqual([{ ID: 1, Name: 'NES' }]);
			});
		});
	});
});
