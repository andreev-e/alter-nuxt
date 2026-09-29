<script>
    let counter = 0;

    export default {
        name: 'MglPolyline',
        inject: ['getMap'],
        props: {
            // Точки как { lat, lng } или [lat, lng]
            latLngs: {
                type: Array,
                default: () => [],
            },
            color: {
                type: String,
                default: '#3388FF',
            },
            weight: {
                type: Number,
                default: 3,
            },
            opacity: {
                type: Number,
                default: 1,
            },
        },
        computed: {
            geojson() {
                return {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: this.latLngs.map((point) => (
                            Array.isArray(point) ? [point[1], point[0]] : [point.lng, point.lat]
                        )),
                    },
                };
            },
            paint() {
                return {
                    'line-color': this.color,
                    'line-width': this.weight,
                    'line-opacity': this.opacity,
                };
            },
        },
        watch: {
            geojson(value) {
                this.getMap().getSource(this.id).setData(value);
            },
            paint(value) {
                Object.keys(value).forEach((property) => {
                    this.getMap().setPaintProperty(this.id, property, value[property]);
                });
            },
        },
        mounted() {
            counter += 1;
            this.id = `polyline-${counter}`;
            const map = this.getMap();
            map.addSource(this.id, { type: 'geojson', data: this.geojson });
            map.addLayer({
                id: this.id,
                type: 'line',
                source: this.id,
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: this.paint,
            });
        },
        // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle -- проект на Vue 2
        beforeDestroy() {
            const map = this.getMap();
            map.removeLayer(this.id);
            map.removeSource(this.id);
        },
        render() {
            return null;
        },
    };
</script>
