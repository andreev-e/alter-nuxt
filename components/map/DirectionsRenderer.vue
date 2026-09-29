<template>
    <l-polyline
        v-if="path.length"
        :lat-lngs="path"
        :weight="5"
        :opacity="0.8"
    />
</template>

<script>
    import polyline from '@mapbox/polyline';
    import { ROUTING_URL, ROUTING_PROFILES } from '../../constants/map';

    export default {
        name: 'DirectionsRenderer',
        props: {
            origin: { type: [Object, Boolean] },
            destination: { type: [Object, Boolean] },
            waypoints: {
                type: Array,
                default: null,
            },
            optimizeWaypoints: {
                type: Boolean,
                default: false,
            },
            travelMode: { type: String, default: 'DRIVING' },
        },
        emits: ['routeFound'],
        data() {
            return {
                path: [],
                requestId: 0,
            };
        },
        computed: {
            url() {
                if (!this.origin || !this.destination) {
                    return null;
                }
                const points = [this.origin, ...(this.waypoints || []), this.destination];
                const coordinates = points.map(({ lat, lng }) => `${lng},${lat}`).join(';');
                const profile = ROUTING_PROFILES[this.travelMode] || ROUTING_PROFILES.DRIVING;
                // trip сам подбирает оптимальный порядок промежуточных точек
                const trip = this.optimizeWaypoints && points.length > 3;
                const params = trip ? '&source=first&destination=last&roundtrip=false' : '';
                return `${ROUTING_URL}/routed-${profile}/${trip ? 'trip' : 'route'}/v1/driving/${coordinates}`
                    + `?overview=full&geometries=polyline${params}`;
            },
        },
        watch: {
            url: {
                handler: 'rebuildRoute',
                immediate: true,
            },
        },
        methods: {
            rebuildRoute() {
                this.requestId += 1;
                const { requestId, url } = this;
                if (!url) {
                    this.path = [];
                    return;
                }
                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        if (requestId !== this.requestId) {
                            return;
                        }
                        const found = data.code === 'Ok' && (data.routes || data.trips || [])[0];
                        if (!found) {
                            this.path = [];
                            this.$emit('routeFound', 0);
                            return;
                        }
                        this.path = polyline.decode(found.geometry);
                        this.$emit('routeFound', Math.round(found.distance / 1000));
                    })
                    .catch(() => {});
            },
        },
    };
</script>
