<template>
  <div class="collection">
    <div class="header">
      <h1>{{ collectionInfo.collection.collectionName }}</h1>
      <p>{{ collectionInfo.collection.description }}</p>
    </div>
    <div class="content">
      <entry-list
        v-if="collectionInfo.articleList.length > 0"
        :article-list="collectionInfo.articleList"
      ></entry-list>
      <el-empty v-else description="暂无数据" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router'
import { reactive, ref } from 'vue'
import { articleListByCollection } from '@/api/article'
import { useRouter, useRoute } from 'vue-router'
import EntryList from '@/components/entry/EntryList.vue'
import useScrollLoad from '@/hooks/useScrollLoad'
const route = useRoute()

const collectionId = route.params.id ?? null

const pageinfo = reactive({
  currentPage: 1,
  pageSize: 10,
  collectionId: route.params.id as string
})

const collectionInfo = reactive({
  articleList: [],
  total: 0,
  collection: null
})

const getArticleListByCollection = async () => {
  const res = await articleListByCollection(pageinfo)
  console.log(res.data)
  collectionInfo.articleList = res.data.articleListVo.rows
  collectionInfo.total = res.data.articleListVo.total
  collectionInfo.collection = res.data.collection
}

getArticleListByCollection()

useScrollLoad(() => {
  //总页数
  let totalPageSum = Math.ceil(collectionInfo.total / pageinfo.pageSize)

  if (totalPageSum >= pageinfo.currentPage) {
    //还有内容加载数据
    //获取下一页的内容
    pageinfo.currentPage += 1
    getArticleListByCollection()
  } else {
    //到底了
  }
})
</script>

<style scoped lang="scss">
.collection {
  width: 100%;
  .header {
    width: 100%;
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    background: url('@/assets/img/background.dc0bb53.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    height: 200px;
    color: #fff;
    font-size: 30px;

    p {
      font-size: 14px;
      margin-top: 12px;
    }
  }
  .content {
    background-color: #fff;
    margin: 10px auto;
    max-width: 1000px;
  }
}
</style>
