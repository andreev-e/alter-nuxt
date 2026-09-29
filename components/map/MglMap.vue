<template>
    <div class="mgl-map">
        <div
            ref="container"
            class="mgl-map__canvas"
        />
        <div
            v-if="ready"
            class="mgl-map__layers"
        >
            <slot />
        </div>
    </div>
</template>

<script>
    import { MAPTILER_STYLE_URL, OSM_STYLE } from '../../constants/map';

    // Зумы в проекте (в том числе в базе) заданы в шкале тайлов 256px, у MapLibre тайлы 512px
    const ZOOM_OFFSET = 1;

    export default {
        name: 'MglMap',
        provide() {
            return {
                getMap: () => this.mapInstance,
            };
        },
        props: {
            center: {
                type: Object,
                required: true,
            },
            zoom: {
                type: Number,
                default: 10,
            },
        },
        emits: ['ready', 'moveend', 'shown'],
        data() {
            return {
                // Сам объект карты хранится вне data, чтобы Vue не делал его реактивным
                ready: false,
            };
        },
        watch: {
            center(value, old) {
                if (this.ready && (value.lat !== old.lat || value.lng !== old.lng)) {
                    this.mapInstance.panTo([value.lng, value.lat]);
                }
            },
            zoom(value) {
                if (this.ready) {
                    this.mapInstance.setZoom(value - ZOOM_OFFSET);
                }
            },
        },
        mounted() {
            const key = this.$config.maptilerKey;
            const map = new this.$maplibregl.Map({
                container: this.$refs.container,
                style: key ? MAPTILER_STYLE_URL + key : OSM_STYLE,
                center: [this.center.lng, this.center.lat],
                zoom: this.zoom - ZOOM_OFFSET,
                attributionControl: { compact: false },
                dragRotate: false,
                pitchWithRotate: false,
                touchPitch: false,
            });
            this.mapInstance = map;
            map.touchZoomRotate.disableRotation();
            map.addControl(new this.$maplibregl.NavigationControl({ showCompass: false }), 'top-left');

            map.on('style.load', () => this.localizeLabels(map));
            map.on('error', (event) => {
                // Ключ не принят или MapTiler недоступен: показываем OSM, чтобы карта не была пустой
                if (!this.styleFailed && !map.isStyleLoaded() && event.error && event.error.status) {
                    this.styleFailed = true;
                    map.setStyle(OSM_STYLE);
                }
            });
            map.once('load', () => {
                this.ready = true;
                this.$emit('ready', map);
            });
            map.on('moveend', () => this.$emit('moveend', map));

            // Карта в скрытой вкладке имеет нулевой размер, сообщаем, когда она стала видна
            let hidden = !this.$refs.container.clientWidth;
            map.on('resize', () => {
                const nowHidden = !this.$refs.container.clientWidth;
                if (hidden && !nowHidden) {
                    this.$emit('shown', map);
                }
                hidden = nowHidden;
            });
        },
        // После дочерних слоёв и маркеров, чтобы они успели убрать себя с карты
        // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle -- проект на Vue 2
        destroyed() {
            if (this.mapInstance) {
                this.mapInstance.remove();
            }
        },
        methods: {
            localizeLabels(map) {
                const lang = this.$i18n.locale;
                const textField = ['coalesce', ['get', `name:${lang}`], ['get', 'name']];
                map.getStyle().layers.forEach((layer) => {
                    if (layer.type !== 'symbol') {
                        return;
                    }
                    const current = map.getLayoutProperty(layer.id, 'text-field');
                    // Номера дорог и домов не трогаем
                    if (current && JSON.stringify(current).includes('name')) {
                        map.setLayoutProperty(layer.id, 'text-field', textField);
                    }
                });
            },
        },
    };
</script>

<style>
    .mgl-map {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .mgl-map__canvas {
        width: 100%;
        height: 100%;
    }

    .mgl-map__layers {
        display: none;
    }
</style>
