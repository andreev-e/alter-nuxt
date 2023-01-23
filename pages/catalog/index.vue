<template>
    <div class="container page">
        <Header />
        <div class="row inner-gal gallery">
            <div
                v-for="poi in pois"
                :key="poi.id"
                class="col-sm-2"
            >
                <PoiCard :poi="poi" />
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pois: [],
                name: '',
            };
        },
        head: {
            title: 'Карта достопримечательностей для самостоятельных путешественников',
            meta: [
                {
                    name: 'description',
                    content: 'Каталог достопримечательностей на карте. Для самостоятельной организации путешествия!',
                },
            ],
        },
        mounted() {
        },
        methods: {
        },
    };
</script>
