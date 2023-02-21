<script>
    import { MapElementFactory } from 'vue2-google-maps';

    export default MapElementFactory({
        name: 'directionsRenderer',
        ctr() {
            return window.google.maps.DirectionsRenderer;
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
            travelMode: { type: String },
        },
        afterCreate(directionsRenderer) {
            const directionsService = new window.google.maps.DirectionsService();
            this.$watch(
                () => [this.origin, this.destination, this.travelMode, this.waypoints, this.optimizeWaypoints],
                () => {
                    const {
                        origin,
                        destination,
                        travelMode,
                        waypoints,
                        optimizeWaypoints,
                    } = this;
                    if (!origin || !destination || !travelMode) {
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
                            if (status !== 'OK') {
                                return;
                            }
                            directionsRenderer.setOptions({ suppressMarkers: true });

                            directionsRenderer.setDirections(response);

                            const myroute = directionsRenderer.directions.routes[0];
                            let total = 0;
                            myroute.legs.forEach((leg) => { total += leg.distance.value; });
                            this.$emit('routeFound', Math.round(total / 1000));
                        },
                    );
                },
            );
        },
    });
</script>
