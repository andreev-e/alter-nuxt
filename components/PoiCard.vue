<template>
    <nuxt-link
        :to="`/${type}/${poi.id}`"
        class="poi__card"
    >
        <div :class="{ 'poi_card loading' :loading, 'poi__content' : !loading, 'disproved' : !poi.show }">
            <div
                v-if="loading || loadingOne"
                class="spinner"
            >
                <b-spinner />
            </div>
            <img
                v-if="poi.thumb"
                :src="poi.thumb"
                class="img-fluid"
                :alt="poi.name"
            >
            <img
                v-else
                src="https://via.placeholder.com/600"
                class="img-fluid"
                :alt="poi.name"
            >
            <div class="img-title">
                {{ poi.name }}
            </div>
            <div
                v-if="poi.dist"
                class="above_img"
            >
                {{ distance }}
            </div>
            <div
                class="author"
            >
                <client-only>
                    <poi-card-buttons
                        :can-edit="canEdit"
                        :can-approve="canApprove"
                        :can-disprove="canDisprove"
                        @edit="$router.push(`/secure/${type}/${poi.id}`)"
                        @approve="approve"
                        @disprove="disprove"
                        @delete="del"
                    />
                </client-only>
            </div>
        </div>
    </nuxt-link>
</template>

<script>
    import { Request } from 'laravel-request-utils';
    // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapMutations } from 'vuex';
    import PoiCardButtons from './poi/PoiCardButtons.vue';

    export default {
        name: 'PoiCard',
        components: { PoiCardButtons },
        props: {
            poi: {
                type: Object,
                required: true,
            },
            loading: {
                type: Boolean,
                default: false,
            },
            type: {
                type: String,
                default: 'poi',
            },
        },
        emits: ['reload'],
        data() {
            return {
                loadingOne: false,
            };
        },
        computed: {
            distance() {
                const dist = Math.round(this.poi.dist);
                if (dist > 5) {
                    return `${dist} км`;
                }
                if (dist === 0) {
                    return `${Math.round(this.poi.dist * 1000)}  м`;
                }
                return `${Math.round(dist, 1)} км`;
            },
            canEdit() {
                return this.$auth.user && (this.isAdmin || this.isOwner);
            },
            canApprove() {
                return !this.poi.show && this.isAdmin;
            },
            canDisprove() {
                return this.poi.show && this.isAdmin;
            },
            isOwner() {
                return this.$auth.user && this.$auth.user.username === this.poi.author;
            },
            isAdmin() {
                return this.$auth.user && this.$auth.user.username === 'andreev';
            },
        },
        methods: {
            ...mapMutations({
                updateOnePoi: 'poisPaginated/updateOne',
                updateOneRoute: 'routesPaginated/updateOne',
            }),
            del() {
                this.loadingOne = true;
                Request.getInstance().delete(`/api/${this.type}/${this.poi.id}`)
                    .then(() => {
                        this.$emit('reload');
                        this.loadingOne = false;
                    });
            },
            changeVisibility(action) {
                this.loadingOne = true;
                Request.getInstance().post(`/api/${this.type}/${this.poi.id}/${action}`)
                    .then(({ data }) => {
                        if (this.type === 'poi') {
                            this.updateOnePoi(data.data);
                        }
                        if (this.type === 'route') {
                            this.updateOneRoute(data.data);
                        }
                    }).finally(() => {
                        this.loadingOne = false;
                    });
            },
            approve() {
                this.changeVisibility('approve');
            },
            disprove() {
                this.changeVisibility('disprove');
            },
        },
    };
</script>

<style>
  .loading {
    opacity: 0.4;
  }

  .poi__card {
    display: block;
    padding: 15px 0;
  }

  .img-title {
    opacity: 0.9;
    background: #7495AA;
    color: #FFF;
    height: 45px;
    font-size: 18px;
    text-align: center;
    z-index: 1;
    padding: 0;
    box-shadow: 0 4px 4px -4px rgb(0 0 0);
    overflow: hidden;
    line-height: 22px;
    border: 1px solid #888;
  }

  .above_img {
    position: absolute;
    z-index: 1;
    top: 0;
    width: 100%;
    margin-top: 50%;
    margin-left: -15px;
    text-align: center;
    font-size: 2em;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: #000 2px 3px 5px;
  }

  .author {
    position: absolute;
    z-index: 1;
    top: 15px;
    right: 15px;
    text-align: right;
    font-size: 1em;
    color: rgba(255, 255, 255, 1);
    text-shadow: #000 2px 3px 5px;
  }

  .disproved {
    opacity: 0.6;
  }
</style>
