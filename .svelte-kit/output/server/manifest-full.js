export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["111281-690770684_small.mp4","1920s-art-deco-mansion-gatsby-party-luxury.jpg","1920s-art-deco-mansion-party.jpg","19th-century-russia-dark-street.jpg","boys-on-deserted-island-survival.jpg","boys-stranded-on-tropical-island-survival.jpg","dark-19th-century-russian-street-atmospheric.jpg","dark-room-insect-kafka.jpg","dark-room-kafka-metamorphosis-surreal.jpg","dystopian-city-surveillance-big-brother-1984.jpg","dystopian-city-surveillance-big-brother.jpg","favicon.png","regency-era-ballroom-england-elegant.jpg","regency-era-ballroom-england.jpg"]),
	mimeTypes: {".mp4":"video/mp4",".jpg":"image/jpeg",".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.Dw7Rkvb0.js",app:"_app/immutable/entry/app.Byt5vmiW.js",imports:["_app/immutable/entry/start.Dw7Rkvb0.js","_app/immutable/chunks/DGacg_c2.js","_app/immutable/chunks/DztSR9n7.js","_app/immutable/chunks/DPorY5mc.js","_app/immutable/entry/app.Byt5vmiW.js","_app/immutable/chunks/DztSR9n7.js","_app/immutable/chunks/DGtZoTxw.js","_app/immutable/chunks/B2rijitG.js","_app/immutable/chunks/DPorY5mc.js","_app/immutable/chunks/BepJJDSh.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/community",
				pattern: /^\/community\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/community/[postId]",
				pattern: /^\/community\/([^/]+?)\/?$/,
				params: [{"name":"postId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/creator",
				pattern: /^\/creator\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/creator/wizard",
				pattern: /^\/creator\/wizard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/play/[novel_id]",
				pattern: /^\/play\/([^/]+?)\/?$/,
				params: [{"name":"novel_id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/profile",
				pattern: /^\/profile\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 9 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
