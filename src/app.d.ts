// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: {
				userId: number;
				username: string;
				accessToken: string;
				refreshToken: string | null;
			} | null;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}

export {};

