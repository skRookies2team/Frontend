
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/community" | "/community/[postId]" | "/creator" | "/creator/wizard" | "/creator/wizard/steps" | "/login" | "/play" | "/play/[novel_id]" | "/profile";
		RouteParams(): {
			"/community/[postId]": { postId: string };
			"/play/[novel_id]": { novel_id: string }
		};
		LayoutParams(): {
			"/": { postId?: string; novel_id?: string };
			"/community": { postId?: string };
			"/community/[postId]": { postId: string };
			"/creator": Record<string, never>;
			"/creator/wizard": Record<string, never>;
			"/creator/wizard/steps": Record<string, never>;
			"/login": Record<string, never>;
			"/play": { novel_id?: string };
			"/play/[novel_id]": { novel_id: string };
			"/profile": Record<string, never>
		};
		Pathname(): "/" | "/community" | "/community/" | `/community/${string}` & {} | `/community/${string}/` & {} | "/creator" | "/creator/" | "/creator/wizard" | "/creator/wizard/" | "/creator/wizard/steps" | "/creator/wizard/steps/" | "/login" | "/login/" | "/play" | "/play/" | `/play/${string}` & {} | `/play/${string}/` & {} | "/profile" | "/profile/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/111281-690770684_small.mp4" | "/favicon.png" | string & {};
	}
}