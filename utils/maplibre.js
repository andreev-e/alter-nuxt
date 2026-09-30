// MapLibre весит почти мегабайт, поэтому грузим его отдельным чанком только там, где есть карта
let loading = null;

export default function loadMaplibre() {
    if (!loading) {
        loading = Promise.all([
            import(/* webpackChunkName: "maplibre" */ 'maplibre-gl'),
            import(/* webpackChunkName: "maplibre" */ 'maplibre-gl/dist/maplibre-gl.css'),
        ]).then(([module]) => module.default || module);
    }
    return loading;
}
