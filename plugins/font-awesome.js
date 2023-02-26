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
    faTrash,
    faCheck,
    faPlus,
    faPlusCircle,
    faTimesCircle,
    faComment,
    faComments,
    faEye,
    faRoute,
    faLocationPin,
    faStar,
    faGlobe,
    faTags,
    faRefresh,
    faHammer,
    faUser,
    faArrowUp,
    faHandHoldingDollar,
    faSignOut,
    faMapMarker,
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
    faTrash,
    faCheck,
    faPlusCircle,
    faPlus,
    faTimesCircle,
    faComment,
    faComments,
    faEye,
    faRoute,
    faLocationPin,
    faStar,
    faGlobe,
    faTags,
    faRefresh,
    faHammer,
    faUser,
    faArrowUp,
    faHandHoldingDollar,
    faSignOut,
    faMapMarker,
);

/* add font awesome icon component */
Vue.component('FontAwesomeIcon', FontAwesomeIcon);

Vue.config.productionTip = false;
