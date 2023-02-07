<template>
    <label
        :id="`${id}-label`"
        :for="id"
        :class="[{ 'sr-only': hidden }, { 'block text-sm font-medium leading-5 text-gray-700 mb-1': !hidden }]"
    >
        {{ label }}
        <span
            v-if="required"
            class="text-gray-400 text-xs"
        >
            *
        </span>
    </label>
</template>

<script>
    export default {
        name: 'InputLabel',
        props: {
            id: {
                type: String,
                required: true,
            },
            label: {
                type: String,
                required: true,
            },
            required: {
                type: Boolean,
                default: false,
            },
            hidden: {
                type: Boolean,
                default: false,
            },
        },
    };
</script>
