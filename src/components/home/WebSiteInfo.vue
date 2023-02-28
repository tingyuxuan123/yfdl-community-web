<template>
  <div class="WebSiteInfo">
    <div class="top">
      <img src="../../assets/img/bg1.jpg" alt="" />
    </div>
    <div class="content">
      <p class="info">
        飞鸟社区，个人程序人生的点滴记录和时光储备。淡泊明志，宁静致远。珍惜原创，矢志不渝。
      </p>
    </div>
    <div class="statistics">统计</div>
    <div class="bottom">
      <ul>
        <li>
          <span class="title">文章</span>
          <span class="value">{{ AllArticleCount }}</span>
        </li>
        <li>
          <span class="title">评论</span>
          <span class="value">{{ AllCommentCount }}</span>
        </li>
        <li>
          <span class="title">成立天数</span>
          <span class="value">{{ createDay }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { articleAndCommentCountInfo } from '@/api/article'
import dayjs from 'dayjs'
const createDate = '2023-01-01' //创建时间
const createTime = dayjs(createDate)
const nowTime = dayjs()
const createDay = ref(0)
createDay.value = nowTime.diff(createTime, 'day')

const AllArticleCount = ref(0)
const AllCommentCount = ref(0)
const handleArticleAndCommentCountInfo = async () => {
  const result = await articleAndCommentCountInfo()
  AllArticleCount.value = result.data.articleCount
  AllCommentCount.value = result.data.commentCount
  console.log(result)
}

handleArticleAndCommentCountInfo()
</script>

<style scoped lang="scss">
.WebSiteInfo {
  width: 275px;
  height: 390px;
  background-color: #fff;

  .top {
    width: 100%;
    height: 200px;

    img {
      width: 100%;
    }
  }
  .content {
    padding: 10px;
    .info {
      text-align: center;
    }
  }

  .statistics {
    position: relative;
    width: 100%;
    text-align: center;

    &::before {
      display: block;
      position: absolute;
      top: 50%;
      width: 40%;
      border-top: 1px solid #e8e8e8;
      transform: translateY(50%);
      content: '';
    }

    &::after {
      display: block;
      position: absolute;
      top: 50%;
      width: 40%;
      border-top: 1px solid #e8e8e8;
      right: 0px;
      content: '';
    }
  }

  .bottom {
    ul {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      li {
        display: flex;
        flex-direction: column;
        align-items: center;

        .value {
          margin-top: 15px;
          background: var(--theme-bg9-color);
          color: #fff;
          padding: 0px 8px;
          border-radius: 999px;
        }
      }
    }
  }
}
</style>
