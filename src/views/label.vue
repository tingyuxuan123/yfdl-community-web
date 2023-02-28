<template>
  <div class="label">
    <div class="title">
      <img :src="tagInfo.spanIcon" alt="" />
      <h2>{{ tagInfo.name }}</h2>
      <span>{{ tagInfo.articleCount }}文章</span>
    </div>
    <entry-list
      v-if="articleList.length > 0"
      :article-list="articleList"
    ></entry-list>
    <el-empty v-else description="暂无数据" />
  </div>
</template>

<script lang="ts" setup>
import { articeListbyTag } from '@/api/article'
import { tagInfoById } from '@/api/tag'
import useScrollLoad from '@/hooks/useScrollLoad'
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const id = route.params.id ? parseInt(route.params.id as string) : null

let queryParams = reactive({
  spanId: id,
  currentPage: 1,
  pageSize: 10
})

const articleList = ref([])
const total = ref(0)
const tagInfo = ref({ spanIcon: null, name: null, articleCount: null })
const getArticeListbyTag = async () => {
  let res = await articeListbyTag(queryParams)
  articleList.value = [...articleList.value, ...res.data.rows]
  total.value = res.data.total
  console.log(res)
}

const getTagInfoById = async () => {
  let res = await tagInfoById(id)
  tagInfo.value = res.data
  console.log(res)
}

getTagInfoById()
getArticeListbyTag()

useScrollLoad(() => {
  //总页数
  let totalPageSum = Math.ceil(total.value / queryParams.pageSize)

  if (totalPageSum >= queryParams.currentPage) {
    //还有内容加载数据
    //获取下一页的内容
    queryParams.currentPage += 1
    getArticeListbyTag()
  } else {
    //到底了
  }
})
</script>

<style scoped lang="scss">
.label {
  width: 1000px;
  background-color: #fff;
  margin-top: 20px;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  h2 {
    font-size: 20px;
  }

  span {
    font-size: 16px;
    color: #909090;
    margin-top: 10px;
    margin-bottom: 15px;
  }
}
</style>
