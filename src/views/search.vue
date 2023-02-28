<template>
  <div class="search">
    <el-tabs
      v-model="searchType"
      class="demo-tabs"
      type="border-card"
      @tab-click="handleSearch(searchParams)"
    >
      <el-tab-pane label="文章" name="article">
        <entry-list
          v-if="articleList.length > 0"
          :article-list="articleList"
        ></entry-list>
        <el-empty v-else description="暂无数据" />
      </el-tab-pane>
      <el-tab-pane label="用户" name="user">
        <UserList :user-list="userList"></UserList>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import UserList from '@/components/search/UserList.vue'
import { useRoute } from 'vue-router'
import { searchArticle, searchUser } from '@/api/search'
import { first } from 'lodash'

//搜索类型
const searchType = ref('article') // 0为默认 搜索文章  1为搜索用户

const total = ref(0)

const params = reactive({
  currentPage: 1,
  pageSize: 10,
  searchParams: ''
})

const route = useRoute()

let searchParams = route.query.query || null

const articleList = ref([])
const userList = ref([])

watch(
  () => route.query.query,
  (newvalue) => {
    handleSearch(newvalue)
  }
)

const handleSearch = async (searchParams: any) => {
  params.searchParams = searchParams
  if (searchType.value == 'article') {
    const result = await searchArticle(params)
    console.log(result)
    articleList.value = result.data.rows
    // handleArticleKeyWordRed(articleList.value) //关键字标红
  } else {
    const result = await searchUser(params)
    userList.value = result.data.rows
    console.log(result)
  }

  console.log(searchParams)
}

// const handleArticleKeyWordRed = (articleList: Array<any>): any => {
//   const res = articleList.map((item) => {
//     item.title = item.title
//       .split(searchParams)
//       .join(`<font color=red>${searchParams}</font>`)
//     item.summary =item.summary()
//   })

//   return res
// }

handleSearch(searchParams)
</script>

<style scoped lang="scss">
.search {
  width: 1000px;
  background-color: #fff;
  margin-top: 20px;
  min-height: calc(100vh - 200px);
}

.el-tabs {
  height: 100%;
}
</style>
