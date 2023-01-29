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

    export default {
        name: 'Index',
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
                usersExist: 'user/itemsExist',
                usersLoading: 'user/loading',
                users: 'user/items',
                meta: 'user/meta',
            }),
        },
        methods: {
            ...mapActions({
                getUsers: 'user/get',
                setParams: 'user/setParams',
                clear: 'user/clear',
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
