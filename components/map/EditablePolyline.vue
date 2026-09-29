<template>
    <l-feature-group>
        <l-polyline
            :lat-lngs="displayPath"
            :color="color"
        />
        <l-marker
            v-for="(point, index) in innerVertices"
            :key="`vertex_${index}`"
            :lat-lng="point"
            :icon="vertexIcon"
            draggable
            @drag="vertexDrag(index + 1, $event)"
            @dragend="emitChange"
            @contextmenu="removeVertex(index + 1)"
        />
        <l-marker
            v-for="(point, index) in midpoints"
            :key="`mid_${index}`"
            :lat-lng="point"
            :icon="midpointIcon"
            draggable
            @drag="midpointDrag(index + 1, $event)"
            @dragend="midpointDragEnd"
        />
    </l-feature-group>
</template>

<script>
    export default {
        name: 'EditablePolyline',
        props: {
            latLngs: {
                type: Array,
                default: () => [],
            },
            color: {
                type: String,
                default: '#FF0000',
            },
        },
        emits: ['change'],
        data() {
            return {
                points: [...this.latLngs],
                // Точка, которую сейчас вытягивают из середины отрезка
                inserting: null,
            };
        },
        computed: {
            displayPath() {
                if (!this.inserting) {
                    return this.points;
                }
                const path = [...this.points];
                path.splice(this.inserting.index, 0, this.inserting.latLng);
                return path;
            },
            // Крайние точки двигаются маркерами старта и финиша
            innerVertices() {
                return this.points.slice(1, -1);
            },
            midpoints() {
                return this.points.slice(1).map((point, index) => ({
                    lat: (this.points[index].lat + point.lat) / 2,
                    lng: (this.points[index].lng + point.lng) / 2,
                }));
            },
            vertexIcon() {
                return this.$L.divIcon({ className: 'polyline-vertex', iconSize: [12, 12] });
            },
            midpointIcon() {
                return this.$L.divIcon({ className: 'polyline-vertex polyline-vertex--mid', iconSize: [10, 10] });
            },
        },
        watch: {
            latLngs(value) {
                this.points = [...value];
            },
        },
        methods: {
            toPoint(event) {
                const { lat, lng } = event.target.getLatLng();
                return { lat, lng };
            },
            vertexDrag(index, event) {
                this.$set(this.points, index, this.toPoint(event));
            },
            removeVertex(index) {
                this.points.splice(index, 1);
                this.emitChange();
            },
            midpointDrag(index, event) {
                this.inserting = { index, latLng: this.toPoint(event) };
            },
            midpointDragEnd() {
                this.points = this.displayPath;
                this.inserting = null;
                this.emitChange();
            },
            emitChange() {
                this.$emit('change', [...this.points]);
            },
        },
    };
</script>

<style>
    .polyline-vertex {
        background: #ffffff;
        border: 2px solid #FF0000;
        border-radius: 2px;
    }

    .polyline-vertex--mid {
        opacity: 0.6;
    }
</style>
