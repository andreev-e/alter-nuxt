<template>
    <div class="bg-white">
        <font-awesome-icon
            v-if="canEdit"
            icon="fa-edit"
            class="m-2 h4 text-primary"
            @click.prevent="$emit('edit')"
        />
        <font-awesome-icon
            v-if="canApprove"
            icon="fa-check"
            class="m-2 h4 text-success"
            @click.prevent="$emit('approve')"
        />
        <font-awesome-icon
            v-if="canDisprove"
            icon="fa-times-circle"
            class="m-2 h4 text-warning"
            @click.prevent="$emit('disprove')"
        />
        <font-awesome-icon
            v-if="canEdit"
            icon="fa-trash"
            class="m-2 h4 text-danger"
            @click.prevent="$emit('delete')"
        />
    </div>
</template>

<script>
    export default {
        name: 'PoiCardButtons',
        props: {
            canEdit: { type: Boolean, default: false },
            canApprove: { type: Boolean, default: false },
            canDisprove: { type: Boolean, default: false },
        },
        emits: ['edit', 'approve', 'disprove', 'delete'],
    };
</script>

<style scoped>

</style>
