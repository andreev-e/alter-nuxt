<template>
    <div class="container page">
        <Header />
        <Breadcrumbs
            :list="[{ name: 'Авторы', url: '' }]"
        />
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    Авторы
                </h1>
            </div>
            <div class="col-sm-12">
                <p>
                    Альтернативный путеводитель — проект авторский.
                    Все достопримечательности добавляются только членами нашего творческого коллектива.
                    Как правило, этому предшествует исследовательская работа и всегда — <u>личное посещение места</u>.
                </p>
                <p>
                    Нас объединяет любовь к путешествиям, необычным и красивым местам.
                    Особое внимание уделяется качеству фотографий и текстового описания.
                    Для одних из нас путешествия - работа, для других хобби.
                    Главное, что вся представленная информация проверена на личном опыте. <br>
                </p>
            </div>
            <div class="col-sm-12">
                <div class="row p-2">
                    <super-gallery :images="images" />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <b-pagination
                    v-if="meta.last_page > 1"
                    v-model="page"
                    :total-rows="meta.total"
                    :per-page="meta.per_page"
                    @change="paginate"
                />
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
  // eslint-disable-next-line import/no-extraneous-dependencies
    import { mapActions, mapGetters } from 'vuex';
    import Breadcrumbs from '../../components/Breadcrumbs.vue';
    import SuperGallery from '../../components/SuperGallery.vue';

    export default {
        name: 'Index',
        components: { SuperGallery, Breadcrumbs },
        data() {
            return {
                page: 1,
            };
        },
        async fetch() {
            await this.paginate(1);
        },
        head: {
            title: 'Авторы',
            meta: [
                {
                    name: 'description',
                    content: 'Участники путеводителя',
                },
            ],
        },
        computed: {
            ...mapGetters({
                usersExist: 'users/itemsExist',
                usersLoading: 'users/loading',
                users: 'users/items',
                meta: 'users/meta',
            }),
            images() {
                return this.users.map((user) => user.images[0])
                    .filter((item) => item);
            },
        },
        methods: {
            ...mapActions({
                getUsers: 'users/get',
                setParams: 'users/setParams',
                clear: 'users/clear',
            }),
            async paginate(page) {
                this.setParams({
                    page,
                });
                await this.getUsers();
            },
        },
    };
</script>

<style>

</style>
