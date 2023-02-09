<template>
    <div class="d-inline">
        {{ shortVal }}
    </div>
</template>

<script>
    export default {
        name: 'Short',
        props: {
            val: { type: String, required: true },
        },
        data() {
            return {
                replace: [
                    { from: 'садовое товарищество', to: 'СНТ' },
                    { from: 'автономная область', to: 'АО' },
                    { from: 'федеральный округ', to: 'ф. о.' },
                    { from: 'автономный округ', to: 'а. окр.' },
                    { from: 'городской округ', to: 'гор. окр.' },
                    { from: 'административный округ', to: 'адм. окр.' },
                    { from: 'муниципальный округ', to: 'мун. окр.' },
                    { from: 'Соединенные Штаты Америки', to: 'США' },
                    { from: 'водохранилище', to: 'вдхр.' },
                    { from: 'еспублика', to: 'есп.' },
                    { from: 'область', to: 'обл.' },
                    { from: 'поселок городского типа', to: 'пгт.' },
                    { from: 'поселок', to: 'пос.' },
                    { from: 'посёлок', to: 'пос.' },
                    { from: 'деревня', to: 'д.' },
                    { from: 'район', to: 'р-н' },
                    { from: 'село', to: 'с.' },
                    { from: 'край', to: 'кр.' },
                    { from: 'урочище', to: 'ур.' },
                ],
            };
        },
        computed: {
            shortVal() {
                let { val } = this;
                this.replace.forEach((item) => {
                    val = val.replace(item.from, item.to);
                });
                return val;
            },
        },
    };
</script>

<style scoped>

</style>
