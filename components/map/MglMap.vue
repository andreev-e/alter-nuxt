<template>
    <div class="mgl-map">
        <div
            ref="container"
            class="mgl-map__canvas"
        />
        <div class="mgl-map__types">
            <button
                v-for="type in mapTypes"
                :key="type"
                type="button"
                class="mgl-map__type"
                :class="{ 'mgl-map__type--active': type === mapType }"
                @click="setMapType(type)"
            >
                {{ $t(type === 'hybrid' ? 'MAP.HYBRID' : 'MAP.SCHEME') }}
            </button>
        </div>
        <div
            v-if="ready"
            class="mgl-map__layers"
        >
            <slot />
        </div>
    </div>
</template>

<script>
    import {
        ESRI_HYBRID_STYLE, MAP_TYPES, MAPTILER_HYBRID_STYLE_URL, MAPTILER_STYLE_URL, OSM_STYLE,
    } from '../../constants/map';

    const MAP_TYPE_STORAGE_KEY = 'mapType';

    // Слои, которые компоненты добавили сами, переносим в новый стиль при его смене
    const OWN_LAYER_PREFIX = 'polyline-';

    function readMapType() {
        try {
            const type = window.localStorage.getItem(MAP_TYPE_STORAGE_KEY);
            return MAP_TYPES.includes(type) ? type : MAP_TYPES[0];
        } catch (e) {
            return MAP_TYPES[0];
        }
    }

    function keepOwnLayers(previous, next) {
        if (!previous) {
            return next;
        }
        const layers = previous.layers.filter((layer) => layer.id.startsWith(OWN_LAYER_PREFIX));
        const sources = {};
        layers.forEach((layer) => {
            sources[layer.source] = previous.sources[layer.source];
        });
        return {
            ...next,
            sources: { ...next.sources, ...sources },
            layers: [...next.layers, ...layers],
        };
    }

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
                mapTypes: MAP_TYPES,
                mapType: MAP_TYPES[0],
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
            this.mapType = readMapType();
            const map = new this.$maplibregl.Map({
                container: this.$refs.container,
                style: this.styleFor(this.mapType),
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
                    this.applyStyle(this.fallbackStyleFor(this.mapType));
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
            styleFor(type) {
                const key = this.$config.maptilerKey;
                if (!key || this.styleFailed) {
                    return this.fallbackStyleFor(type);
                }
                return (type === 'hybrid' ? MAPTILER_HYBRID_STYLE_URL : MAPTILER_STYLE_URL) + key;
            },
            fallbackStyleFor(type) {
                return type === 'hybrid' ? ESRI_HYBRID_STYLE : OSM_STYLE;
            },
            applyStyle(style) {
                this.mapInstance.setStyle(style, { diff: false, transformStyle: keepOwnLayers });
            },
            setMapType(type) {
                if (type === this.mapType) {
                    return;
                }
                this.mapType = type;
                try {
                    window.localStorage.setItem(MAP_TYPE_STORAGE_KEY, type);
                } catch (e) {
                    // Без localStorage выбор просто не запомнится
                }
                this.applyStyle(this.styleFor(type));
            },
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

    .mgl-map__types {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 2;
        display: flex;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    }

    .mgl-map__type {
        padding: 4px 10px;
        border: 0;
        background: #fff;
        color: #333;
        font-size: 13px;
        line-height: 1.4;
        cursor: pointer;
    }

    .mgl-map__type + .mgl-map__type {
        border-left: 1px solid #ddd;
    }

    .mgl-map__type:hover {
        background: #f2f2f2;
    }

    .mgl-map__type--active,
    .mgl-map__type--active:hover {
        background: #333;
        color: #fff;
    }

    .mgl-map__layers {
        display: none;
    }
</style>
