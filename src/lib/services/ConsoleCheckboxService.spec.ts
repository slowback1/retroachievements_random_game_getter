import ConsoleCheckboxService from '$lib/services/ConsoleCheckboxService';
import { beforeEach, expect } from 'vitest';
import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

describe('ConsoleCheckboxService', () => {
	let service: ConsoleCheckboxService;

	beforeEach(() => {
		MessageBus.clearAll();

		service = new ConsoleCheckboxService();
	});

	function getCheckedConsoles() {
		return MessageBus.getLastMessage<number[]>(Messages.CheckedConsoles);
	}

	it('initially sets the message for the list of checked consoles to an empty array if it is empty at construction', () => {
		let checkedConsoles = getCheckedConsoles();

		expect(checkedConsoles).toEqual([]);
	});

	it('does not overwrite an already existing set of checked consoles when initializing', () => {
		MessageBus.sendMessage(Messages.CheckedConsoles, [1]);

		service = new ConsoleCheckboxService();

		let checkedConsoles = getCheckedConsoles();

		expect(checkedConsoles).toEqual([1]);
	});

	it('onCheck adds the given id to the list of checked consoles', () => {
		service.onCheck(1);

		let checkedConsoles = getCheckedConsoles();

		expect(checkedConsoles).toEqual([1]);
	});

	it('onCheck will work for multiple unique ids', () => {
		service.onCheck(1);
		service.onCheck(2);
		service.onCheck(3);

		let checkedConsoles = getCheckedConsoles();

		expect(checkedConsoles).toEqual([1, 2, 3]);
	});

	it('onCheck when called twice with the same id removes the id', () => {
		service.onCheck(1);
		service.onCheck(1);

		let checkedConsoles = getCheckedConsoles();

		expect(checkedConsoles).toEqual([]);
	});

	it.each([
		[2, false],
		[1, true]
	])(
		'can indicate whether or not a console has been checked (%s, %s)',
		(givenId, expectedResult) => {
			service.onCheck(1);

			let isChecked = service.isChecked(givenId);

			expect(isChecked).toEqual(expectedResult);
		}
	);
});
