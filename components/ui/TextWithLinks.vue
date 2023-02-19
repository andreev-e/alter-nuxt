<template>
    <p v-html="linkedText" />
</template>

<script>
    export default {
        name: 'TextWithLinks',
        props: {
            text: {
                type: String, default: '',
            },
        },
        computed: {
            linkedText() {
                return this.text.replace(/(http:\/\/[^\s]+)/g, "<a target='_blank' href='$1'>$1</a><br>");
            },
        },
    };
</script>

<style scoped>

</style>
