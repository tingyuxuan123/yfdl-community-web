<template>
  <div class="HotArticleList">
    <ul>
      <li
        v-for="article in articleList"
        :key="article.id"
        @click="handleClick(article.id)"
      >
        <div class="left">
          <img :src="article.thumbnail" alt="" />
        </div>
        <div class="right">
          <p class="title">{{ article.title }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { hotArticleList } from '@/api/article'
import { useRouter } from 'vue-router'

const router = useRouter()

const articleList = ref([])

const handleHotArticleList = async () => {
  const result = await hotArticleList()
  articleList.value = result.data
}

handleHotArticleList()

const handleClick = (id: number) => {
  let { href } = router.resolve({
    name: 'detail',
    params: {
      id: id
    }
  })
  window.open(href, '_blank')
}
</script>

<style scoped lang="scss">
.HotArticleList {
  li {
    display: flex;
    height: 60px;
    align-items: center;
    .left {
      img {
        width: 66px;
        height: 34px;
      }
    }

    .right {
      padding-left: 10px;

      .title {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden; //溢出内容隐藏
        text-overflow: ellipsis; //文本溢出部分用省略号表示
        display: -webkit-box; //特别显示模式
        -webkit-line-clamp: 2; //行数
        line-clamp: 2;
        -webkit-box-orient: vertical; //盒子中内容竖直排列

        &:hover {
          color: var(--theme-text5-color);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
