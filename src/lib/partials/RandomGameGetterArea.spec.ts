import type { RenderResult } from '@testing-library/svelte';
import RandomGameGetterArea from '$lib/partials/RandomGameGetterArea.svelte';
import { afterEach, beforeEach } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

describe('RandomGameGetterArea', () => {
	let result: RenderResult<RandomGameGetterArea>;

	function renderComponent(props = {}) {
		if (result) result.unmount();

		result = render(RandomGameGetterArea, props);
	}

	afterEach(() => {
		MessageBus.clearAll();
	});

	describe('when the user info is not set', () => {
		beforeEach(() => {
			renderComponent();
		});

		it('should render a message telling the user to set up the user info up above', () => {
			let message = result.getByTestId('warning-message');

			expect(message).toBeInTheDocument();

			expect(message).toHaveTextContent('Please fill out the RetroAchievements user info above');
		});
	});

	describe('when the user info is set', () => {
		beforeEach(() => {
			MessageBus.sendMessage(Messages.RetroAchievementsUser, 'testuser');
			MessageBus.sendMessage(Messages.RetroAchievementsApiKey, 'api-key');

			renderComponent();
		});

		it('does not render the warning  message', () => {
			let message = result.queryByTestId('warning-message');

			expect(message).not.toBeInTheDocument();
		});

		it('contains a toggle switch for the homebrew filtering', () => {
			let toggle = result.getByTestId('homebrew-filter');

			expect(toggle).toBeInTheDocument();
		});

		it('clicking the homebrew toggle updates the message bus for the homebrew filter', () => {
			let toggle = result.getByTestId('homebrew-filter');

			fireEvent.click(toggle.querySelector('button'));

			let homebrewFilter = MessageBus.getLastMessage<boolean>(Messages.FilterHomebrewGames);

			expect(homebrewFilter).toEqual(false);
		});
	});
});
