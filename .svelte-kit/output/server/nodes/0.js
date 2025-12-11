import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.DpFFdxV4.js","_app/immutable/chunks/B2rijitG.js","_app/immutable/chunks/DztSR9n7.js","_app/immutable/chunks/DPorY5mc.js","_app/immutable/chunks/BepJJDSh.js","_app/immutable/chunks/BNNCyM1d.js","_app/immutable/chunks/DGtZoTxw.js","_app/immutable/chunks/B3wEnzUG.js","_app/immutable/chunks/D-MY2_0s.js","_app/immutable/chunks/DGacg_c2.js","_app/immutable/chunks/fm54UEUU.js"];
export const stylesheets = ["_app/immutable/assets/0.CeyZdOxw.css"];
export const fonts = [];
