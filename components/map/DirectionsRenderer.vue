<script>
    import { MapElementFactory } from 'vue2-google-maps';

    export default MapElementFactory({
        name: 'DirectionsRenderer',
        ctr() {
            return window.google ? window.google.maps.DirectionsRenderer : null;
        },
        events: ['routeFound'],
        mappedProps: {},
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
        data() {
            return {
                dR: null,
            };
        },
        created() {
            this.rebuildRoute();
        },
        methods: {
            rebuildRoute() {
                const directionsService = window.google ? new window.google.maps.DirectionsService() : null;
                const {
                    origin,
                    destination,
                    travelMode,
                    waypoints,
                    optimizeWaypoints,
                } = this;
                if (!origin || !destination) {
                    return;
                }
                directionsService.route(
                    {
                        origin,
                        destination,
                        travelMode,
                        waypoints,
                        optimizeWaypoints,
                    },
                    (response, status) => {
                        if (status === 'OK') {
                            this.dR.setDirections(response);
                            const myroute = this.dR.directions.routes[0];
                            let total = 0;
                            myroute.legs.forEach((leg) => { total += leg.distance.value; });
                            this.$emit('routeFound', Math.round(total / 1000));
                            return;
                        }
                        if (status === 'ZERO_RESULTS') {
                            this.$emit('routeFound', 0);
                        }
                        // console.log(status);
                    },
                );
            },
        },
        afterCreate(directionsRenderer) {
            directionsRenderer.setOptions({ suppressMarkers: true });
            this.dR = directionsRenderer;

            this.$watch(
                () => [this.origin, this.destination, this.travelMode, this.waypoints, this.optimizeWaypoints],
                () => {
                    this.rebuildRoute();
                },
            );
        },
    });
</script>
