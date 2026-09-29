// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import L from 'leaflet';
import {
    LMap, LTileLayer, LMarker, LPolyline, LFeatureGroup,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Webpack ломает пути к стандартной иконке маркера, задаём их явно
// eslint-disable-next-line no-underscore-dangle
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

Vue.component('LMap', LMap);
Vue.component('LTileLayer', LTileLayer);
Vue.component('LMarker', LMarker);
Vue.component('LPolyline', LPolyline);
Vue.component('LFeatureGroup', LFeatureGroup);

export default (context, inject) => {
    inject('L', L);
};
