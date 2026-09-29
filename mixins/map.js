import * as Icons from '@fortawesome/free-solid-svg-icons';
import polyline from '@mapbox/polyline';
import { TYPES } from '../constants/index';

const MARKER_SIZE = 30;
const GLYPH_SIZE = 15;
const iconCache = {};

export default {
    methods: {
        getIcon(name) {
            if (iconCache[name]) {
                return iconCache[name];
            }
            const type = this.getTypeByName(name);
            const faIcon = type ? Icons[type.icon] : Icons.faCircleExclamation;
            const color = type?.color ?? '#E0493F';
            const [width, height, , , path] = faIcon.icon;
            // Глиф вписываем в квадрат GLYPH_SIZE по центру круглого бейджа
            const scale = GLYPH_SIZE / Math.max(width, height);
            const offsetX = (MARKER_SIZE - width * scale) / 2;
            const offsetY = (MARKER_SIZE - height * scale) / 2;
            const center = MARKER_SIZE / 2;
            iconCache[name] = {
                className: 'map-poi-icon',
                html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARKER_SIZE} ${MARKER_SIZE}" width="${MARKER_SIZE}" height="${MARKER_SIZE}">`
                    + `<circle cx="${center}" cy="${center}" r="${center - 1.5}" fill="${color}" stroke="#ffffff" stroke-width="2"/>`
                    + `<path d="${path.toString()}" fill="#ffffff" transform="translate(${offsetX} ${offsetY}) scale(${scale})"/></svg>`,
                size: [MARKER_SIZE, MARKER_SIZE],
            };
            return iconCache[name];
        },
        getImageIcon(url, size) {
            return { url, size, anchor: 'bottom' };
        },
        getTypeByName(name) {
            return TYPES.reduce((acc, type) => {
                if (type.name === name) {
                    return type;
                }
                return acc;
            });
        },
        decodePath(encoded) {
            return polyline.decode(encoded).map(([lat, lng]) => ({ lat, lng }));
        },
        encodePath(path) {
            return polyline.encode(path.map(({ lat, lng }) => [lat, lng]));
        },
        pathLength(path) {
            let total = 0;
            for (let i = 1; i < path.length; i += 1) {
                total += this.distance(path[i - 1], path[i]);
            }
            return total;
        },
        distance(p1, p2) {
            const R = 6378137; // Earth’s mean radius in meter
            const dLat = this.rad(p2.lat - p1.lat);
            const dLong = this.rad(p2.lng - p1.lng);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.cos(this.rad(p1.lat)) * Math.cos(this.rad(p2.lat))
          * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        },
        rad(x) {
            return (x * Math.PI) / 180;
        },
    },
};
