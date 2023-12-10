export default function mockFetch(response: any) {
	let mockedFetch = vi.fn(() => {
		return new Promise((res) => {
			return res({
				json: () => {
					return new Promise((jsonResponse) => {
						return jsonResponse(response);
					});
				}
			});
		});
	});

	global.fetch = mockedFetch as any;

	return mockedFetch;
}
