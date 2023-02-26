// eslint-disable-next-line import/no-extraneous-dependencies
import { mapActions } from 'vuex';
import { Request } from 'laravel-request-utils';

export default {
    computed: {},
    methods: {
        ...mapActions({
            setId: 'user/setId',
            setProperty: 'user/setProperty',
        }),
        inFav(id) {
            return process.client
                && this.$auth
                && this.$auth.user
                && this.$auth.user.favorites
                && this.$auth.user.favorites.includes(id);
        },
        toggleFav(id) {
            Request.getInstance().patch(`/api/poi/${id}/toggle-favorite`).then(() => {
                this.$auth.fetchUser();
            });
        },
    },
};
