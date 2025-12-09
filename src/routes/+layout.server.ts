/**
 * Root Layout Server Load
 * Passes user data from event.locals to page data
 */

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user
	};
};

