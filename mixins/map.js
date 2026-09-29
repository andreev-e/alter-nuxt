import * as Icons from '@fortawesome/free-solid-svg-icons';
import polyline from '@mapbox/polyline';
import { TYPES } from '../constants/index';

const ICON_HEIGHT = 24;
const iconCache = {};

export default {
    methods: {
        getIcon(name) {
            if (iconCache[name]) {
                return iconCache[name];
            }
            const type = this.getTypeByName(name);
            const faIcon = type ? Icons[type.icon] : Icons.faCircleExclamation;
            const [width, height, , , path] = faIcon.icon;
            const iconWidth = Math.round((ICON_HEIGHT * width) / height);
            iconCache[name] = {
                className: 'map-poi-icon',
                html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${iconWidth}" height="${ICON_HEIGHT}">`
                    + `<path d="${path.toString()}" fill="${type.color ?? '#FF0000'}" stroke="#ffffff" stroke-width="20"/></svg>`,
                size: [iconWidth, ICON_HEIGHT],
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
