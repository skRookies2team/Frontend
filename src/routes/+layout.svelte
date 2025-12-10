<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/navbar.svelte';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getCookie } from '$lib/utils/cookies';
	
	let { children, data } = $props();
	
	// Hide navbar on game play pages
	let showNavbar = $derived(!$page.url.pathname.startsWith('/play'));
	
	// Initialize auth store from server data or cookies (only once on mount)
	onMount(() => {
		// Try server data first (for preview/dev mode)
		if (data.user) {
			authStore.init({
				userId: data.user.userId,
				username: data.user.username,
				accessToken: data.user.accessToken,
				refreshToken: data.user.refreshToken
			});
		} else if (browser) {
			// Fallback to cookies for static build (CloudFront + S3)
			const accessToken = getCookie('accessToken');
			const refreshToken = getCookie('refreshToken');
			const userId = getCookie('userId');
			const username = getCookie('username');
			
			if (accessToken && userId && username) {
				authStore.init({
					userId: parseInt(userId, 10),
					username,
					accessToken,
					refreshToken: refreshToken || null
				});
			} else {
				authStore.init(null);
			}
		} else {
			authStore.init(null);
		}
	});
</script>

{#if showNavbar}
	<Navbar />
{/if}

{@render children()}
