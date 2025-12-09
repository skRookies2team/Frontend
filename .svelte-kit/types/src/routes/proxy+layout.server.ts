// @ts-nocheck
/**
 * Root Layout Server Load
 * Passes user data from event.locals to page data
 */

import type { LayoutServerLoad } from './$types';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
	return {
		user: locals.user
	};
};

