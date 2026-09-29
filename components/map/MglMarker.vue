<script>
    // Иконка: { html, className, size: [w, h] } или { url, size: [w, h] }, без неё — стандартный маркер
    function createElement(icon) {
        const element = document.createElement('div');
        if (icon.className) {
            element.className = icon.className;
        }
        if (icon.html) {
            element.innerHTML = icon.html;
        }
        if (icon.url) {
            element.style.backgroundImage = `url(${icon.url})`;
            element.style.backgroundSize = 'contain';
            element.style.backgroundRepeat = 'no-repeat';
        }
        const [width, height] = icon.size;
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
        return element;
    }

    export default {
        name: 'MglMarker',
        inject: ['getMap'],
        props: {
            latLng: {
                type: Object,
                required: true,
            },
            icon: {
                type: Object,
                default: null,
            },
            title: {
                type: String,
                default: null,
            },
            draggable: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['click', 'contextmenu', 'drag', 'dragend'],
        watch: {
            latLng(value) {
                this.marker.setLngLat([value.lng, value.lat]);
            },
            icon() {
                this.marker.remove();
                this.createMarker();
            },
        },
        mounted() {
            this.createMarker();
        },
        // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle -- проект на Vue 2
        beforeDestroy() {
            this.marker.remove();
        },
        methods: {
            createMarker() {
                const options = { draggable: this.draggable };
                if (this.icon) {
                    options.element = createElement(this.icon);
                    options.anchor = this.icon.anchor || 'center';
                }
                this.marker = new this.$maplibregl.Marker(options)
                    .setLngLat([this.latLng.lng, this.latLng.lat])
                    .addTo(this.getMap());

                const element = this.marker.getElement();
                if (this.title) {
                    element.title = this.title;
                }
                element.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.$emit('click', event);
                });
                element.addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    this.$emit('contextmenu', event);
                });
                this.marker.on('drag', () => this.$emit('drag', this.getLatLng()));
                this.marker.on('dragend', () => this.$emit('dragend', this.getLatLng()));
            },
            getLatLng() {
                const { lat, lng } = this.marker.getLngLat();
                return { lat, lng };
            },
        },
        render() {
            return null;
        },
    };
</script>
