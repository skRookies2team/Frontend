<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/navbar.svelte';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getCookie } from '$lib/utils/cookies';
	
	let { children } = $props();
	
	// Hide navbar on game play pages
	let showNavbar = $derived(!$page.url.pathname.startsWith('/play'));
	
	// Initialize auth store from cookies (client-side only for S3 static deployment)
	onMount(() => {
		if (browser) {
			// Read user data from cookies for static build (CloudFront + S3)
			// S3 is a static storage, not a server, so we cannot use server-side data
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
