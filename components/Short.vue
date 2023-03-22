<template>
    <div
        v-if="val"
        class="d-inline"
    >
        {{ shortVal }}
    </div>
</template>

<script>
    export default {
        name: 'Short',
        props: {
            val: { type: String, required: false, default: null },
        },
        data() {
            return {
                replace: [
                    { from: 'город республиканского значения', to: 'г. респ. зн.' },
                    { from: 'садовое товарищество', to: 'СНТ' },
                    { from: 'автономное сообщество', to: 'а.с.' },
                    { from: 'автономная область', to: 'АО' },
                    { from: 'федеральный округ', to: 'ф. о.' },
                    { from: 'автономный округ', to: 'а. окр.' },
                    { from: 'городской округ', to: 'гор. окр.' },
                    { from: 'административный округ', to: 'адм. окр.' },
                    { from: 'муниципальный округ', to: 'мун. окр.' },
                    { from: 'Соединённые Штаты Америки', to: 'США' },
                    { from: 'водохранилище', to: 'вдхр.' },
                    { from: 'еспублика', to: 'есп.' },
                    { from: 'область', to: 'обл.' },
                    { from: 'поселок городского типа', to: 'пгт.' },
                    { from: 'поселок', to: 'пос.' },
                    { from: 'посёлок', to: 'пос.' },
                    { from: 'деревня', to: 'д.' },
                    { from: 'айон', to: '-н' },
                    { from: 'село', to: 'с.' },
                    { from: 'край', to: 'кр.' },
                    { from: 'урочище', to: 'ур.' },
                    { from: 'муниципалитет', to: 'мун.' },
                    { from: 'втономная', to: 'вт.' },
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
