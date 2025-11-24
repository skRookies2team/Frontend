<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/navbar.svelte';
	import { page } from '$app/stores';
	
	let { children } = $props();
	
	// Hide navbar on game play pages
	let showNavbar = $derived(!$page.url.pathname.startsWith('/play'));
</script>

{#if showNavbar}
	<Navbar />
{/if}

{@render children()}
