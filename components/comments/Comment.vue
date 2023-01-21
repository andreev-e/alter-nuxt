<template>
  <div class="comment">
    <div class="author-date">
      <b>
        <router-link :to="'/user/' + comment.name">
          {{ comment.name }}
        </router-link>
      </b>
      <i>{{ $moment(comment.time * 1000) }}</i>
      <router-link
        v-if="linkObjects"
        :to="'/poi/' + comment.backlink"
      >
        об объекте
        {{ comment.object_name }}
      </router-link>
    </div>
    <div class="comment-text-wrapper">
      <div class="comment-text">
        <p>{{ comment.comment }}</p>
      </div>
    </div>
    <hr v-if="index !== total - 1">
  </div>
</template>

<script>
  export default {
    name: 'Comment',
    props: {
      comment: {
        type: Object,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      linkObjects: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
  }
</script>

<style scoped>

</style>
