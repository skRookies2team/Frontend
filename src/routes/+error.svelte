<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let errorStatus = $derived($page.status);
	let errorMessage = $derived($page.error?.message || '알 수 없는 오류가 발생했습니다.');

	let title = $derived(
		errorStatus === 404
			? '페이지를 찾을 수 없습니다'
			: errorStatus === 500
			? '서버 오류가 발생했습니다'
			: '오류가 발생했습니다'
	);

	let description = $derived(
		errorStatus === 404
			? '요청하신 페이지가 존재하지 않거나 이동되었습니다.'
			: errorStatus === 500
			? '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
			: errorMessage
	);

	function goHome() {
		goto('/');
	}

	function goBack() {
		window.history.back();
	}
</script>

<svelte:head>
	<title>{errorStatus} - {title}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
	<div class="max-w-2xl w-full text-center">
		<!-- Error Status -->
		<div class="mb-8">
			<h1 class="text-9xl font-bold text-purple-600 mb-4">
				{errorStatus}
			</h1>
			<h2 class="text-3xl font-semibold text-gray-800 mb-4">
				{title}
			</h2>
			<p class="text-lg text-gray-600 mb-8">
				{description}
			</p>
		</div>

		<!-- Illustration -->
		<div class="mb-8">
			<svg
				class="w-64 h-64 mx-auto text-purple-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				{#if errorStatus === 404}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				{:else}
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				{/if}
			</svg>
		</div>

		<!-- Actions -->
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<button
				onclick={goBack}
				class="px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
			>
				이전 페이지로
			</button>
			<button
				onclick={goHome}
				class="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
			>
				홈으로 돌아가기
			</button>
		</div>

		<!-- Additional Info for Developers (only in dev mode) -->
		{#if import.meta.env.DEV && $page.error}
			<details class="mt-8 text-left bg-gray-100 rounded-lg p-4">
				<summary class="cursor-pointer font-semibold text-gray-700 mb-2">
					개발자 정보 (개발 모드에서만 표시)
				</summary>
				<pre class="text-sm text-gray-600 overflow-auto">{JSON.stringify($page.error, null, 2)}</pre>
			</details>
		{/if}
	</div>
</div>
