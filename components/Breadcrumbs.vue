<template>
    <div class="content row">
        <div class="navigation col-12">
            <ul
                itemscope
                itemtype="https://schema.org/BreadcrumbList"
            >
                <li
                    itemprop="itemListElement"
                    itemscope
                    itemtype="https://schema.org/ListItem"
                    class="first"
                >
                    <router-link to="/">
                        <font-awesome-icon
                            icon="fa-home"
                            :style="{ height: '14px' }"
                        />
                        {{ $t('ALTERTRAVEL') }}
                    </router-link>
                </li>
                <li v-if="loading">
                    <span>
                        <b-spinner small />
                    </span>
                </li>
                <template v-else>
                    <li
                        v-for="(crumb, index) in list"
                        :key="`crumb_${index}`"
                        itemprop="itemListElement"
                        itemscope
                        itemtype="https://schema.org/ListItem"
                    >
                        <font-awesome-icon
                            icon="fa-arrow-right"
                            class="mr-1"
                            :style="{ height: '14px' }"
                        />
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
                </template>
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
    float: left;
    margin-left: 7px;
    font-size: 16px;
  }

  .navigation a {
    color: #27475c;
  }

  .navigation li.first {
    margin-left: 0;
  }
</style>
