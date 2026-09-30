// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue';

// eslint-disable-next-line import/no-extraneous-dependencies
import { library } from '@fortawesome/fontawesome-svg-core';

// eslint-disable-next-line import/no-extraneous-dependencies
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons: по одному файлу, импорт из общего индекса тянет в бандл весь набор */
import { faMountainSun } from '@fortawesome/free-solid-svg-icons/faMountainSun';
import { faIndustry } from '@fortawesome/free-solid-svg-icons/faIndustry';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons/faCircleExclamation';
import { faLandmarkDome } from '@fortawesome/free-solid-svg-icons/faLandmarkDome';
import { faBuildingColumns } from '@fortawesome/free-solid-svg-icons/faBuildingColumns';
import { faMonument } from '@fortawesome/free-solid-svg-icons/faMonument';
import { faScroll } from '@fortawesome/free-solid-svg-icons/faScroll';
import { faEdit } from '@fortawesome/free-solid-svg-icons/faEdit';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment';
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faRoute } from '@fortawesome/free-solid-svg-icons/faRoute';
import { faLocationPin } from '@fortawesome/free-solid-svg-icons/faLocationPin';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faTags } from '@fortawesome/free-solid-svg-icons/faTags';
import { faRefresh } from '@fortawesome/free-solid-svg-icons/faRefresh';
import { faHammer } from '@fortawesome/free-solid-svg-icons/faHammer';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp';
import { faSignOut } from '@fortawesome/free-solid-svg-icons/faSignOut';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons/faMapMarker';
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers';

/* add icons to the library */
library.add(
    faMountainSun,
    faIndustry,
    faCircleExclamation,
    faLandmarkDome,
    faBuildingColumns,
    faMonument,
    faScroll,
    faEdit,
    faArrowRight,
    faHome,
    faTrash,
    faCheck,
    faCheckCircle,
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
    faSignOut,
    faMapMarker,
    faUsers,
);

/* add font awesome icon component */
Vue.component('FontAwesomeIcon', FontAwesomeIcon);

Vue.config.productionTip = false;
