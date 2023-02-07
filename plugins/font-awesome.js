// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';

// eslint-disable-next-line import/no-extraneous-dependencies
import { library } from '@fortawesome/fontawesome-svg-core';

// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import {
    faLeaf,
    faIndustry,
    faCircleExclamation,
    faBuilding,
    faMuseum,
    faMonument,
    faSkull,
    faEdit,
    faArrowRight,
    faHome,
} from '@fortawesome/free-solid-svg-icons';

/* add icons to the library */
library.add(
    faLeaf,
    faIndustry,
    faCircleExclamation,
    faBuilding,
    faMuseum,
    faMonument,
    faSkull,
    faEdit,
    faArrowRight,
    faHome,
);

/* add font awesome icon component */
Vue.component('FontAwesomeIcon', FontAwesomeIcon);

Vue.config.productionTip = false;
