export const MAPTILER_STYLE_URL = 'https://api.maptiler.com/maps/streets-v2/style.json?key=';

export const MAPTILER_HYBRID_STYLE_URL = 'https://api.maptiler.com/maps/hybrid/style.json?key=';

export const MAP_TYPES = ['streets', 'hybrid'];

// Запасной стиль, если ключа MapTiler нет или он не принят
export const OSM_STYLE = {
    version: 8,
    sources: {
        osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            maxzoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        },
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

const ESRI_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services';

// Запасной гибрид: снимки и подписи Esri
export const ESRI_HYBRID_STYLE = {
    version: 8,
    sources: {
        imagery: {
            type: 'raster',
            tiles: [`${ESRI_TILES}/World_Imagery/MapServer/tile/{z}/{y}/{x}`],
            tileSize: 256,
            maxzoom: 19,
            attribution: 'Tiles &copy; Esri',
        },
        roads: {
            type: 'raster',
            tiles: [`${ESRI_TILES}/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}`],
            tileSize: 256,
            maxzoom: 19,
        },
        labels: {
            type: 'raster',
            tiles: [`${ESRI_TILES}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`],
            tileSize: 256,
            maxzoom: 19,
        },
    },
    layers: [
        { id: 'imagery', type: 'raster', source: 'imagery' },
        { id: 'roads', type: 'raster', source: 'roads' },
        { id: 'labels', type: 'raster', source: 'labels' },
    ],
};

export const ROUTING_URL = 'https://routing.openstreetmap.de';

export const ROUTING_PROFILES = {
    DRIVING: 'car',
    TWO_WHEELER: 'car',
    WALKING: 'foot',
};
