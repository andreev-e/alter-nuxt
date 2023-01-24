<template>
    <div class="container page">
        <Header />
        <div class="row">
            <div class="col-sm-12">
                <h1>
                    Авторы
                </h1>
            </div>
            <div class="col-sm-3">
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
            <div class="col-sm-9">
                <user-card
                    v-for="user in users"
                    :key="user.username"
                    :user="user"
                />
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <b-pagination
                    v-if="pages > 1"
                    v-model="page"
                    :total-rows="pages"
                    :per-page="perPage"
                    aria-controls="my-table"
                />
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
    export default {
        name: 'Index',
        data() {
            return {
                users: [],
                page: 1,
                pages: null,
                perPage: 15,
                loadingUsers: true,
            };
        },
        async fetch() {
            await this.fetchUsers();
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
        watch: {
            page: {
                handler() {
                    this.fetchUsersBackend();
                },
            },
        },
        methods: {
            async fetchUsers() {
                this.loadingPois = true;
                const {
                    data,
                    meta,
                } = await this.$axios.$get(
                    '/user',
                    {
                        params: {
                            page: this.page,
                            perPage: this.perPage,
                        },
                    },
                );
                this.users = data;
                this.pages = meta.last_page;
                this.loadingUsers = false;
            },
        },
    };
</script>

<style>

</style>
