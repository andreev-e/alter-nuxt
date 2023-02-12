<template>
    <div class="row footer">
        <div class="first_menu col-sm-4">
            <!--      <router-link to="/register/">Регистрация</router-link>-->
        </div>
        <div class="copyright col-sm-4">
            2009-{{ year }} © Альтернативный путеводитель
        </div>
        <div class="second_menu col-sm-4">
            <router-link to="/user/">
                Авторы
            </router-link>
        </div>
        <!-- Yandex.Metrika counter -->
        <script type="text/javascript">
            (function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function () {
            (m[i].a = m[i].a || []).push(arguments)
            }
            m[i].l = 1 * new Date()
            for (var j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) {
            return
            }
            }
            k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
            })
            (window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

            ym(10896850, 'init', {
            clickmap: true,
            defer: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            })
        </script>
        <noscript>
            <div><img src="https://mc.yandex.ru/watch/10896850" style="position:absolute; left:-9999px;" alt="" /></div>
        </noscript>
    <!-- /Yandex.Metrika counter -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                year: 'year',
            };
        },
        mounted() {
            this.year = new Date().getFullYear();
        },
    };
</script>

<style>
</style>
