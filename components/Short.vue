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
                    { from: 'автономная область', to: 'АО' },
                    { from: 'еспублика', to: 'есп.' },
                    { from: 'область', to: 'обл.' },
                    { from: 'село', to: 'с.' },
                    { from: 'край', to: 'кр.' },
                    { from: 'федеральный округ', to: 'ф. о.' },
                    { from: 'автономный округ', to: 'а. окр.' },
                    { from: 'городской округ', to: 'гор. окр.' },
                    { from: 'муниципальный округ', to: 'мун. окр.' },
                    { from: 'Соединенные Штаты Америки', to: 'США' },
                    { from: 'водохранилище', to: 'водохр.' },
                    { from: 'поселок городского типа', to: 'пгт.' },
                    { from: 'посёлок', to: 'пос.' },
                    { from: 'деревня', to: 'д.' },
                    { from: 'район', to: 'р-н' },
                    { from: 'садовое товарищество', to: 'СНТ' },
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
