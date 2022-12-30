<template>
  <div class="entry_list_container">
    <entry-list-header @handle-click="menuClick"></entry-list-header>
    <entry-list :articleList="articles" v-if="articles"></entry-list>
    <el-skeleton v-else :rows="5" animated />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import EntryListHeader from './EntryListHeader.vue'
import EntryList from '@/components/entry/EntryList.vue'
import {
  articleList,
  articleListByRecommended,
  articleListByNew
} from '@/api/article'
import type { ArticleListInfo } from '@/api/apiType'
let pageinfo = {
  currentPage: 1,
  pageSize: 10
}

let articles = ref<ArticleListInfo[]>(null)

const currentMenu = ref('推荐')

const getArticleListByRecommended = async () => {
  const res: any = await articleListByRecommended()
  articles.value = res.data.rows
}

const getArticleListByNew = async () => {
  const res: any = await articleListByNew()
  articles.value = res.data.rows
}

watch(currentMenu, (newValue: string) => {
  switch (newValue) {
    case '推荐':
      getArticleListByRecommended()
      break
    case '最新':
      getArticleListByNew()
      break
    case '热榜':
      console.log('热榜')
      break
  }
})

getArticleListByRecommended()

//menu改变
let menuClick = (menu: any) => {
  currentMenu.value = menu.menuname
}
</script>

<style scoped lang="scss">
.entry_list_container {
  width: 100%;

  /* padding: 10px; */
  box-sizing: border-box;
  background-color: var(--theme-bg4-color);
  .entry-list-header {
  }
}
</style>
