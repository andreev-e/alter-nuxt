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
    },
};
