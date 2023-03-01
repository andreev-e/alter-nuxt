import * as Icons from '@fortawesome/free-solid-svg-icons';
import { TYPES } from '../constants/index';

export default {
    created() {
        //
    },
    methods: {
        getIcon(name) {
            const type = this.getTypeByName(name);
            return {
                path: (type ? Icons[type.icon] : Icons.faCircleExclamation).icon[4].toString(),
                fillColor: type.color ?? '#FF0000',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                scale: 0.05,
                strokeWeight: 1,
            };
        },
        getTypeByName(name) {
            return TYPES.reduce((acc, type) => {
                if (type.name === name) {
                    return type;
                }
                return acc;
            });
        },
        distance(p1, p2) {
            const R = 6378137; // Earth’s mean radius in meter
            const dLat = this.rad(p2.lat() - p1.lat());
            const dLong = this.rad(p2.lng() - p1.lng());
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.cos(this.rad(p1.lat())) * Math.cos(this.rad(p2.lat()))
          * Math.sin(dLong / 2) * Math.sin(dLong / 2);
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        },
        rad(x) {
            return (x * Math.PI) / 180;
        },
    },
};
