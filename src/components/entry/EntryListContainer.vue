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
  articleListByRecommended,
  articleListByNew,
  articleListByDynamic
} from '@/api/article'
import type { ArticleListInfo } from '@/api/apiType'
import { useUserStore } from '@/stores/userStore'
import { usescrollStore } from '@/stores/useScroll'
import { ElMessage } from 'element-plus'
import useScrollLoad from '@/hooks/useScrollLoad'

const userStore = useUserStore()
const scrollStore = usescrollStore()

const total = ref(0)

let pageinfo = {
  currentPage: 1,
  pageSize: 10
}

const isLogin = () => {
  if (userStore.token) {
    //如果token 不存在，说明没登录
    return true
  } else {
    ElMessage({
      message: '还未登录,请登录后操作！',
      type: 'warning'
    })
    scrollStore.isVisibleLoginForm = true

    return false
  }
}

let articles = ref<ArticleListInfo[]>([])

const currentMenu = ref('推荐')

const getArticleListByRecommended = async () => {
  const res: any = await articleListByRecommended(pageinfo)
  articles.value = [...articles.value, ...res.data.rows]
  total.value = res.data.total
}

const getArticleListByNew = async () => {
  const res: any = await articleListByNew(pageinfo)
  articles.value = [...articles.value, ...res.data.rows]
  total.value = res.data.total
}

const getArticleListByFollowing = async () => {
  const res: any = await articleListByDynamic(pageinfo)
  articles.value = [...articles.value, ...res.data.rows]
  total.value = res.data.total
}

watch(currentMenu, (newValue: string) => {
  //清空当前列表
  articles.value = []
  console.log(articles.value)

  // 重置当前页数
  pageinfo.currentPage = 1
  switch (newValue) {
    case '推荐':
      getArticleListByRecommended()

      break
    case '最新':
      getArticleListByNew()
      break
    case '动态':
      getArticleListByFollowing()
      break
  }
})
//默认加载推荐
getArticleListByRecommended()

//menu改变
let menuClick = (menu: any) => {
  if (menu.menuname == '动态') {
    let b = isLogin()
    if (!b) {
      return
    }
  }
  currentMenu.value = menu.menuname
}

useScrollLoad(() => {
  //总页数
  let totalPageSum = Math.ceil(total.value / pageinfo.pageSize)

  if (totalPageSum >= pageinfo.currentPage) {
    //还有内容加载数据
    //获取下一页的内容
    pageinfo.currentPage += 1

    switch (currentMenu.value) {
      case '推荐':
        getArticleListByRecommended()
        break
      case '最新':
        getArticleListByNew()
        break
      case '动态':
        getArticleListByFollowing()
        break
    }
    console.log('dfs')
  } else {
    //到底了
    console.log('到底了')
  }
})
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
