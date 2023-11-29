import type { RenderResult } from '@testing-library/svelte';
import TextBox from '$lib/ui/inputs/TextBox.svelte';
import { beforeEach } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';

describe('TextBox', () => {
	let result: RenderResult<TextBox>;

	function renderComponent(props = {}) {
		if (result) result.unmount();

		result = render(TextBox, props);
	}

	beforeEach(() => {
		renderComponent();
	});

	it('renders a text input', () => {
		expect(result.getByRole('textbox')).toBeDefined();
	});

	it('can update the input type', () => {
		renderComponent({ type: 'password' });

		let input = result.container.querySelector('input');

		expect(input.type).toEqual('password');
	});

	it('calls the onChange handler when changing the input', () => {
		let onChange = vi.fn();

		renderComponent({ onChange });

		let input = result.container.querySelector('input');

		fireEvent.change(input, { target: { value: 'test' } });

		expect(onChange).toHaveBeenCalled();
	});

	it('passes the label to the textbox', () => {
		renderComponent({ label: 'test label' });

		let label = result.container.querySelector('label');

		expect(label.textContent).toEqual('test label');
	});

	it('generates an id based off of the label', () => {
		renderComponent({ label: 'test label' });

		let input = result.container.querySelector('input');

		expect(input.id).toEqual('test-label');
	});

	it('sets the given id', () => {
		renderComponent({ label: 'test label', id: 'some-other-id' });

		let input = result.container.querySelector('input');

		expect(input.id).toEqual('some-other-id');
	});

	it('sets the value', () => {
		renderComponent({ value: 'value' });

		let input = result.container.querySelector('input');

		expect(input.value).toEqual('value');
	});

	it("the label has the given test id with '-label' appended to the end of it", () => {
		renderComponent({ id: 'test-id', label: 'my cool label' });

		let label = result.getByTestId('test-id-label');

		expect(label).toBeInTheDocument();
		expect(label).toHaveTextContent('my cool label');
	});

	it('can mark the input has required', () => {
		renderComponent({ id: 'test-id', required: true });

		let input = result.getByTestId('test-id');

		expect(input).toBeRequired();
	});
});
