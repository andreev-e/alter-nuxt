<!-- Please remove this file from your project -->
<template>
    <div class="header row">
        <div class="logo col-sm-3">
            <nuxt-link :to="'/'">
                <img
                    src="https://altertravel.ru/i/logo.png"
                    alt="Альтернативный путеводитель"
                >
            </nuxt-link>
        </div>
        <Menu />
    </div>
</template>

<style scoped>
  .header {
    padding: 10px 0;
  }
  .row {
    background: #ebf1f5;
  }
</style>
