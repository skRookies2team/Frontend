/**
 * Root Layout Server Load
 * Passes user data from event.locals to page data
 * 
 * Note: For static build (CloudFront + S3), this will return null
 * and authentication will be handled client-side
 */

import type { LayoutServerLoad } from './$types';
import { building } from '$app/environment';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Static build 시 서버 사이드 데이터 없음
	if (building) {
		return {
			user: null
		};
	}
	
	// Preview/Dev 모드에서만 서버 사이드 데이터 사용
	return {
		user: locals.user || null
	};
};

