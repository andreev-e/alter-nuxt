<template>
    <div class="position-relative mr-2 mb-2">
        <div
            v-if="loading"
            class="d-flex justify-content-center position-absolute w-100 h-100 bg-white"
            style="opacity: 75%"
        >
            <b-spinner class="align-self-center" />
        </div>
        <div
            v-else-if="canDelete"
            class="position-absolute"
        >
            <font-awesome-icon
                icon="fa-trash"
                role="button"
                class="text-white"
                @click="$emit('delete')"
            />
        </div>
        <a
            v-if="full"
            :href="full"
            target="_blank"
        >
            <img
                class="img-fluid"
                :src="url"
                :alt="alt"
            >
        </a>
        <img
            v-else
            class="img-fluid"
            :src="url"
            :alt="alt"
        >
    </div>
</template>

<script>
    export default {
        name: 'Preview',
        props: {
            url: {
                type: String,
                required: true,
            },
            full: {
                type: String,
                required: false,
                default: null,
            },
            alt: {
                type: String,
                required: true,
            },
            loading: {
                type: Boolean,
                default: false,
            },
            canDelete: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['delete'],
    };
</script>
