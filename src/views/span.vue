<template>
  <div class="span">
    <div class="content">
      <div class="header">
        <el-input
          class="search"
          size="large"
          placeholder="搜索标签"
          v-model="queryParams.name"
          :suffix-icon="Search"
          @keydown="toSearch"
        />
      </div>
      <ul>
        <li v-for="tag in tags" :key="tag.id">
          <div class="img">
            <img @click="handleClick(tag.id)" :src="tag.spanIcon" alt="" />
          </div>
          <h2 @click="handleClick(tag.id)">{{ tag.name }}</h2>
          <span>{{ tag.articleCount }}文章</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { tagList } from '@/api/tag'
import { useRouter } from 'vue-router'

type QueryParams = {
  name?: string | undefined
  currentPage: number | undefined
  pageSize: number | undefined
  status?: string | undefined
}

type TagList = {
  id: number
  name: string
  spanIcon: string
  articleCount: number
}

let queryParams = reactive<QueryParams>({
  currentPage: 1,
  pageSize: 20
})

const total = ref(0)

const tags = ref<Array<TagList>>([])

const getTagList = async () => {
  const res = await tagList(queryParams)
  tags.value = res.data.rows
  total.value = res.data.total
  console.log(res)
}

getTagList()

const toSearch = (e: KeyboardEvent) => {
  console.log(e.code)

  if (e.code === 'Enter') {
    if (queryParams.name == '') {
      queryParams.name = null
    }
    getTagList()
  }
}

const router = useRouter()
const handleClick = (id: number) => {
  let { href } = router.resolve({
    name: 'label',
    params: {
      id: id
    }
  })
  window.open(href, '_blank')
}
</script>

<style scoped lang="scss">
.span {
  width: 100%;
  display: flex;
  justify-content: center;

  .content {
    width: var(--content-width);
  }
  .header {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 5px;
  }
  .search {
    width: 240px;
  }

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    li {
      box-sizing: border-box;
      width: 195px;
      height: 195px;
      padding: 15px;
      background-color: #fff;
      margin-bottom: 20px;
      margin-right: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .img {
        width: 60px;
        height: 60px;
        margin-top: 20px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          cursor: pointer;
        }
      }

      h2 {
        margin-top: 10px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
      }

      span {
        font-size: 16px;
        color: #909090;
        margin-top: 15px;
      }
    }
  }
}
</style>
