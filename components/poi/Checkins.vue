<template>
    <div>
        <div
            v-if="poi"
            class="p-4"
            :class="vasHere ? `text-right` : `text-center`"
            :style="vasHere ? `font-size: 18px` : `font-size: 30px`"
            role="button"
            @click="checkIn"
        >
            <template v-if="vasHere">
                <font-awesome-icon
                    icon="fa-check-circle"
                    class="text-danger mr-2"
                />
                Я не был тут...
            </template>
            <template v-else>
                <font-awesome-icon
                    icon="fa-check-circle"
                    class="text-success mr-2"
                />
                Я побывал тут!
            </template>
        </div>
        <super-gallery
            v-if="images.length"
            :images="images"
            :max-height-of-row="150"
        />
    </div>
</template>

<script>
    import { Request } from 'laravel-request-utils';
    import SuperGallery from '../SuperGallery.vue';

    export default {
        name: 'Checkins',
        components: { SuperGallery },
        props: {
            poi: {
                type: [Object, Boolean],
                required: false,
                default: false,
            },
            user: {
                type: [Object, Boolean],
                required: false,
                default: false,
            },
        },
        emits: ['change'],
        computed: {
            vasHere() {
                return this.$auth.loggedIn && this.poi.checkins && this.poi.checkins.reduce((acc, checkin) => acc || checkin.user.username === this.$auth.user.username, false);
            },
            images() {
                if (this.poi && this.poi.checkins && this.poi.checkins.length) {
                    return this.poi.checkins.map((checkin) => {
                        const image = checkin.user.images[0];
                        image.href = `/user/${checkin.user.username}`;
                        image.copyright = checkin.user.username;
                        return image;
                    })
                        .filter((item) => item);
                }
                if (this.user && this.user.checkins && this.user.checkins.length) {
                    return this.user.checkins.map((checkin) => {
                        const image = checkin.poi.images[0];
                        image.href = `/poi/${checkin.poi.id}`;
                        image.place = checkin.poi.name;
                        return image;
                    })
                        .filter((item) => item);
                }
                return [];
            },
        },
        methods: {
            checkIn() {
                if (this.$auth.user) {
                    Request.getInstance().patch(`/api/checkin/${this.poi.id}`)
                        .then(() => {
                            this.$emit('change');
                            if (!this.vasHere) {
                                this.$message.success('Зачекинен. Напишете отзыв?');
                            }
                        });
                } else {
                    this.$message.warning('Пожалуйста, сначала авторизуйтесь');
                }
            },
        },
    };
</script>

<style scoped>

</style>
