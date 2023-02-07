<template>
    <nuxt-link
        :to="`/poi/${poi.id}`"
        class="poi__card"
    >
        <div :class="loading ? 'poi_card loading' : 'poi__content'">
            <div
                v-if="loading"
                class="spinner"
            >
                <b-spinner />
            </div>
            <img
                :src="'https://altertravel.ru/thumb.php?f=/images/' + poi.id + '.jpg'"
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
                <nuxt-link
                    v-if="$auth.user?.username === poi.author"
                    :to="`/secure/poi/${poi.id}`"
                >
                    <font-awesome-icon
                        icon="fa-edit"
                    />
                </nuxt-link>
                <span v-else>{{ poi.author }}</span>
            </div>
        </div>
    </nuxt-link>
</template>

<script>
    export default {
        name: 'PoiCard',
        props: {
            poi: {
                type: Object,
                required: true,
            },
            loading: {
                type: Boolean,
                default: false,
            },
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
        },
    };
</script>

<style>
  .loading {
    opacity: 0.4;
  }

  .spinner {
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.5);
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
    width: 100%;
    top:15px;
    right:20px;
    text-align: right;
    font-size: 1em;
    color: rgba(255, 255, 255, 1);
    text-shadow: #000 2px 3px 5px;
  }
</style>
