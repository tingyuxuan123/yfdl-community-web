<template>
  <div class="category">
    <div class="header">
      <h1>全部分类</h1>
      <ul class="categoryList">
        <li
          v-for="(item, index) in categorys"
          :class="{ active: index == categoryInfo.index }"
          :key="item.id"
          @click="handleClick(item.id, index)"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="currentInfo">
        <p class="current">当前分类：{{ categoryInfo.current }}</p>
        <p class="count">当前分类共：{{ categoryInfo.count }} 篇文章</p>
      </div>
    </div>
    <entry-list
      v-if="articleList.length"
      :article-list="articleList"
    ></entry-list>
    <el-empty v-else description="暂无数据" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { categoryList } from '@/api/category'
import { articleListByCategoryId } from '@/api/article'
import EntryList from '@/components/entry/EntryList.vue'
import useScrollLoad from '@/hooks/useScrollLoad'

//定义分类列表
const categorys = ref([])
const categoryInfo = reactive({
  current: '',
  count: 0,
  index: 0
})

//获取分类列表
const getCategoryList = async () => {
  const res = await categoryList()
  categorys.value = res.data
  categoryInfo.current = categorys.value[0].name
  pageinfo.categoryId = categorys.value[0].id
  getArticleListByCategoryId()
}

const articleList = ref([])
const pageinfo = reactive({
  currentPage: 1,
  pageSize: 10,
  categoryId: 1
})

const getArticleListByCategoryId = async () => {
  const res = await articleListByCategoryId(pageinfo)
  articleList.value = [...articleList.value, ...res.data.rows]
  categoryInfo.count = res.data.total
}

const handleClick = (id: number, index: number) => {
  pageinfo.categoryId = id
  categoryInfo.index = index
  //重置文章列表
  articleList.value = []
  //重置当前页
  pageinfo.currentPage = 1
  getArticleListByCategoryId()
}

useScrollLoad(() => {
  //总页数
  let totalPageSum = Math.ceil(categoryInfo.count / pageinfo.pageSize)

  if (totalPageSum >= pageinfo.currentPage) {
    //还有内容加载数据
    //获取下一页的内容
    pageinfo.currentPage += 1
    getArticleListByCategoryId()
  } else {
    //到底了
  }
})

getCategoryList()
</script>

<style scoped lang="scss">
.category {
  width: var(--content-width);
  background-color: #fff;
  margin-top: 20px;
  padding: 20px;

  .header {
    margin-bottom: 10px;
  }

  h1 {
    font-size: 18px;
    font-weight: 400;
    margin-bottom: 15px;
  }

  .categoryList {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    li {
      padding: 5px 8px;
      cursor: pointer;
      margin-right: 4px;
      &:hover {
        background-color: rgba($color: #000000, $alpha: 0.2);
        border-radius: 999px;
      }
    }

    .active {
      background-color: rgba($color: #000000, $alpha: 0.2);
      border-radius: 999px;
    }
  }

  .currentInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    padding: 20px 0px;

    .current {
      font-size: 18px;
      margin-bottom: 5px;
    }
    .count {
    }
  }
}
</style>
