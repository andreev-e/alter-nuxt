<template>
    <div>
        <mgl-polyline
            :lat-lngs="displayPath"
            :color="color"
        />
        <mgl-marker
            v-for="(point, index) in innerVertices"
            :key="`vertex_${index}`"
            :lat-lng="point"
            :icon="vertexIcon"
            draggable
            @drag="vertexDrag(index + 1, $event)"
            @dragend="emitChange"
            @contextmenu="removeVertex(index + 1)"
        />
        <mgl-marker
            v-for="(point, index) in midpoints"
            :key="`mid_${index}`"
            :lat-lng="point"
            :icon="midpointIcon"
            draggable
            @drag="midpointDrag(index + 1, $event)"
            @dragend="midpointDragEnd"
        />
    </div>
</template>

<script>
    import MglMarker from './MglMarker.vue';
    import MglPolyline from './MglPolyline.vue';

    export default {
        name: 'EditablePolyline',
        components: { MglMarker, MglPolyline },
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
                return { className: 'polyline-vertex', size: [12, 12] };
            },
            midpointIcon() {
                return { className: 'polyline-vertex polyline-vertex--mid', size: [10, 10] };
            },
        },
        watch: {
            latLngs(value) {
                this.points = [...value];
            },
        },
        methods: {
            vertexDrag(index, latLng) {
                this.$set(this.points, index, latLng);
            },
            removeVertex(index) {
                this.points.splice(index, 1);
                this.emitChange();
            },
            midpointDrag(index, latLng) {
                this.inserting = { index, latLng };
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
        cursor: move;
    }

    .polyline-vertex--mid {
        opacity: 0.6;
    }
</style>
