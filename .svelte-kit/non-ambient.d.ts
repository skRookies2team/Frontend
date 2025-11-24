
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
		RouteId(): "/" | "/community" | "/creator" | "/login" | "/play" | "/play/[novel_id]" | "/profile";
		RouteParams(): {
			"/play/[novel_id]": { novel_id: string }
		};
		LayoutParams(): {
			"/": { novel_id?: string };
			"/community": Record<string, never>;
			"/creator": Record<string, never>;
			"/login": Record<string, never>;
			"/play": { novel_id?: string };
			"/play/[novel_id]": { novel_id: string };
			"/profile": Record<string, never>
		};
		Pathname(): "/" | "/community" | "/community/" | "/creator" | "/creator/" | "/login" | "/login/" | "/play" | "/play/" | `/play/${string}` & {} | `/play/${string}/` & {} | "/profile" | "/profile/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/1920s-art-deco-mansion-gatsby-party-luxury.jpg" | "/1920s-art-deco-mansion-party.jpg" | "/19th-century-russia-dark-street.jpg" | "/boys-on-deserted-island-survival.jpg" | "/boys-stranded-on-tropical-island-survival.jpg" | "/dark-19th-century-russian-street-atmospheric.jpg" | "/dark-room-insect-kafka.jpg" | "/dark-room-kafka-metamorphosis-surreal.jpg" | "/dystopian-city-surveillance-big-brother-1984.jpg" | "/dystopian-city-surveillance-big-brother.jpg" | "/favicon.png" | "/regency-era-ballroom-england-elegant.jpg" | "/regency-era-ballroom-england.jpg" | string & {};
	}
}