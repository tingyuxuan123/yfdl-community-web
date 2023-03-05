<template>
  <div class="enrty-list">
    <transition-group
      appear
      name="animate__animated animate__heartBeat"
      enter-active-class="animate__fadeInUp"
      leave-active-class="leave_animate"
    >
      <template v-for="(article, index) in articleList" :key="article.id">
        <EntryItem
          class="enterItem"
          :article="article"
          :data-index="index"
        ></EntryItem>
      </template>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { ArticleListInfo } from '@/api/apiType'
import EntryItem from './EntryItem.vue'

type Props = {
  articleList: ArticleListInfo[]
}
let props = defineProps<Props>()
</script>

<style scoped lang="scss">
.leave_animate {
  display: none;
}
</style>
