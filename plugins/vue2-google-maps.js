// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyDVxoYcrB_2arTNlYpFClzzKy9KgFW3_Y8',
        libraries: 'geometry',
    },
});
