import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default (context, inject) => {
    inject('maplibregl', maplibregl);
};
