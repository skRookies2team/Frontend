<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/navbar.svelte';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	
	let { children, data } = $props();
	
	// Hide navbar on game play pages
	let showNavbar = $derived(!$page.url.pathname.startsWith('/play'));
	
	// Initialize auth store from server data (only once on mount)
	onMount(() => {
		if (data.user) {
			authStore.init({
				userId: data.user.userId,
				username: data.user.username,
				accessToken: data.user.accessToken,
				refreshToken: data.user.refreshToken
			});
		} else {
			authStore.init(null);
		}
	});
</script>

{#if showNavbar}
	<Navbar />
{/if}

{@render children()}
