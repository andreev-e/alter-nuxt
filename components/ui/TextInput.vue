<template>
    <b-row class="my-2">
        <b-col cols="4">
            {{ label }}
        </b-col>
        <b-col cols="8">
            <textarea
                v-if="multiline"
                class="w-100"
                :value="value"
            />
            <input
                v-else
                class="w-100"
                :type="type"
                :name="name"
                :value="value"
                @input="$emit('input', $event.target.value)"
            >
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: 'TextInput',
        props: {
            label: { type: String, required: true },
            value: { type: String, required: true },
            type: { type: String, default: 'text' },
            multiline: { type: Boolean, default: false },
        },
        computed: {
            name() {
                return this.label.toLowerCase();
            },
        },
    };
</script>
