<template>
  <div class="UserList">
    <ul v-if="userList.length > 0">
      <li v-for="userInfo in userList" :key="userInfo.id">
        <div class="left">
          <div class="userImg">
            <img :src="userInfo.avatar" alt="" />
          </div>
          <div class="info">
            <h2 class="name">{{ userInfo.nickName }}</h2>
            <p class="label">{{ userInfo.label }}</p>
            <div class="likes">
              <span> 获得 {{ userInfo.likesCount }} 赞</span>
              <span> {{ userInfo.readCount }} 阅读</span>
            </div>
          </div>
        </div>

        <div class="followBtn">
          <el-button type="primary" plain @click="handleFollow(userInfo.id)">
            {{ isFollow(userInfo.id) ? '已关注' : '关注' }}</el-button
          >
        </div>
      </li>
    </ul>
    <el-empty v-else description="暂无数据" />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { follow } from '@/utils/utils'

type Props = {
  userList: Array<any>
}

type FollowInfo = {
  avatar?: string
  id?: number
  label?: string
  nickName?: string
  likesCount?: number
  readCount?: number
}

const userStore = useUserStore()

const isFollow = (id: number) => {
  if (userStore.followIds.indexOf(id) === -1) {
    return false
  } else {
    return true
  }
}

const handleFollow = async (id: number) => {
  await follow(id)
}

const props = defineProps<Props>()
</script>

<style scoped lang="scss">
.UserList {
  ul {
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 15px;

      border-bottom: 1px solid rgba(178, 186, 194, 0.15);

      .left {
        display: flex;
        align-items: center;
      }

      .userImg {
        margin-right: 20px;
        img {
          width: 60px;
          height: 60px;
          border-radius: 888px;
        }
      }
      .info {
        .name {
          color: #7dbaff;
          /* color: #1e80ff; */
        }
        .label,
        .likes {
          color: #b9c0c8;
          font-size: 14px;
        }
      }

      .el-button {
        width: 80px;
      }
    }
  }
}
</style>
