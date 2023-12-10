import MessageBus from '$lib/bus/MessageBus';
import { Messages } from '$lib/bus/Messages';

export default class ConsoleCheckboxService {
	constructor() {
		this.initializeConsoleList();
	}

	private initializeConsoleList() {
		let checkedConsoles: number[] | null = MessageBus.getLastMessage(Messages.CheckedConsoles);

		if (!checkedConsoles) MessageBus.sendMessage(Messages.CheckedConsoles, []);
	}

	private getCurrentConsoleList() {
		return MessageBus.getLastMessage<number[]>(Messages.CheckedConsoles);
	}

	onCheck(id: number) {
		let consoleList = this.getCurrentConsoleList();

		if (consoleList.includes(id)) consoleList.splice(consoleList.indexOf(id), 1);
		else consoleList.push(id);

		MessageBus.sendMessage(Messages.CheckedConsoles, consoleList);
	}

	isChecked(id: number) {
		let consoleList = this.getCurrentConsoleList();

		return consoleList.includes(id);
	}
}
