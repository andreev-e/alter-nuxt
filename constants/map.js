export const MAPTILER_STYLE_URL = 'https://api.maptiler.com/maps/streets-v2/style.json?key=';

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

export const ROUTING_URL = 'https://routing.openstreetmap.de';

export const ROUTING_PROFILES = {
    DRIVING: 'car',
    TWO_WHEELER: 'car',
    WALKING: 'foot',
};
