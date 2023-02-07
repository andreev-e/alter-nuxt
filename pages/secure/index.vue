<template>
    <div class="container page">
        <Header />
        <div class="row">
            <div class="col-sm-12 text-center">
                <h1>
                    Личный кабинет {{ $auth.user.username }}
                </h1>
                {{ $auth.user }}
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
    export default {
        middleware: 'auth',
        data() {
            return {

            };
        },
    };
</script>

<style>

</style>
