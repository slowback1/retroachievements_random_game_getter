import type { RenderResult } from '@testing-library/svelte';
import RegistrationArea from '$lib/partials/RegistrationArea.svelte';
import { act, fireEvent, render } from '@testing-library/svelte';
import { beforeEach } from 'vitest';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

describe('RegistrationArea', () => {
	let result: RenderResult<RegistrationArea>;

	function renderComponent(props = {}) {
		if (result) result.unmount();

		result = render(RegistrationArea, { props });
	}

	beforeEach(() => {
		renderComponent();
	});

	it('contains a collapsible area for registration', () => {
		let container = result.container.querySelector('details');

		expect(container).toBeInTheDocument();
		let summary = container.firstChild;

		expect(summary.nodeName).toEqual('SUMMARY');

		expect(summary.textContent).toContain('Enter your RetroAchievements Information Here');
	});

	it('contains a form to register', () => {
		let form = result.container.querySelector('form');

		expect(form).toBeInTheDocument();

		let userNameField = result.getByTestId('register__username');
		expect(userNameField).toBeInTheDocument();

		let apiKeyField = result.getByTestId('register__api-key');
		expect(apiKeyField).toBeInTheDocument();

		let submitButton = result.getByTestId('register__submit');
		expect(submitButton).toBeInTheDocument();
	});

	it('the api key is treated as a password', () => {
		let apiKeyField = result.getByTestId('register__api-key') as HTMLInputElement;

		expect(apiKeyField.type).toEqual('password');
	});

	it.each(['username', 'api-key'])('indicates that both the %s field is required', (testId) => {
		let field = result.getByTestId(`register__${testId}`) as HTMLInputElement;

		expect(field.required).toEqual(true);
	});

	async function fillOutAndSubmitForm() {
		let userNameField: HTMLInputElement = result.getByTestId(
			'register__username'
		) as HTMLInputElement;
		await act(async () => {
			userNameField.value = 'rajang';
			await fireEvent.change(userNameField, { target: { value: 'rajang' } });
		});
		let apiKeyField = result.getByTestId('register__api-key') as HTMLInputElement;
		await act(async () => {
			apiKeyField.value = 'teostra';
			await fireEvent.change(apiKeyField, { target: { value: 'teostra' } });
		});
		let submitButton = result.getByTestId('register__submit');
		await act(async () => {
			await fireEvent.click(submitButton);
		});
	}

	it('updates the message bus with the user data when successfully submitting the form', async () => {
		await fillOutAndSubmitForm();

		let user = MessageBus.getLastMessage(Messages.RetroAchievementsUser);
		let apiKey = MessageBus.getLastMessage(Messages.RetroAchievementsApiKey);

		expect(user).toEqual('rajang');
		expect(apiKey).toEqual('teostra');
	});

	it('displays a success message after submitting the form', async () => {
		await fillOutAndSubmitForm();

		let successMessage = result.getByTestId('register__success');

		expect(successMessage).toBeInTheDocument();
		expect(successMessage.textContent).toContain('User Info Updated!');
	});

	it('can close the success message', async () => {
		await fillOutAndSubmitForm();

		let closeButton = result.getByTestId('register__success-close');

		await act(async () => {
			await fireEvent.click(closeButton);
		});

		let successMessage = result.container.querySelector("[data-testid='register__success']");

		expect(successMessage).not.toBeInTheDocument();
	});

	it('can fill in the fields with default values if the message bus already has messages', () => {
		MessageBus.sendMessage(Messages.RetroAchievementsUser, 'hector');
		MessageBus.sendMessage(Messages.RetroAchievementsApiKey, 'robin');

		renderComponent();

		let userNameField = result.getByTestId('register__username') as HTMLInputElement;
		expect(userNameField).toHaveValue('hector');

		let apiKeyField = result.getByTestId('register__api-key');
		expect(apiKeyField).toHaveValue('robin');
	});
});
