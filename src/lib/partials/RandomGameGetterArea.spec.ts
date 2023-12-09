import type { RenderResult } from '@testing-library/svelte';
import RandomGameGetterArea from '$lib/partials/RandomGameGetterArea.svelte';
import { afterEach, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
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

		it('');
	});
});
