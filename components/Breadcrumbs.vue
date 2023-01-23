<template>
    <div class="content row">
        <div class="navigation col-12">
            <ul>
                <li class="first">
                    <router-link to="/">
                        <img
                            src="https://altertravel.ru/i/first_li.png"
                            alt="Home"
                        >
                    </router-link>
                </li>
                <li
                    v-for="crumb in list"
                    :key="`crumb_${crumb.name}`"
                >
                    <router-link
                        v-if="crumb.url"
                        :to="crumb.url"
                    >
                        {{ crumb.name }}
                    </router-link>
                    <span v-else>
                        {{ crumb.name }}
                    </span>
                </li>
                <li v-if="loading">
                    <span>
                        <b-spinner small />
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Breadcrumbs',
        props: {
            list: {
                type: Array,
                required: false,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>

<style>
  .navigation li {
    list-style-image: url('https://altertravel.ru/i/list_style.png');
    float: left;
    margin-left: 24px;
    font-size: 17px;
  }

  .navigation a {
    color: #27475c;
  }

  .navigation li.first {
    list-style-image: none;
    margin-left: 0;
  }
</style>
