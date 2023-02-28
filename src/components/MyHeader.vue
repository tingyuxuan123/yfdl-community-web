<template>
  <div class="myheader">
    <div class="content">
      <div class="myheader-left">
        <div class="logo"><img src="/logo.png" alt="" />飞鸟</div>
        <my-menu :menu-list="menuList" :route="true"></my-menu>
      </div>
      <div class="myheader-right">
        <div class="search">
          <el-input
            placeholder="搜索"
            v-model="searchValue"
            :suffix-icon="Search"
            @keydown="toSearch"
          ></el-input>
        </div>
        <div class="notificationDiv" @click="toNotification">
          <span class="unreadCount" v-show="chatStore.unreadCount > 0">{{
            chatStore.unreadCount
          }}</span>
          <i class="iconfont icon-bell notification"></i>
          <!-- <el-dropdown>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="toNotification">
                  私信
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown> -->
        </div>

        <!-- <el-switch
          v-model="theme"
          class="mt-2"
          style="margin-left: 24px"
          inline-prompt
          :active-icon="Check"
          :inactive-icon="Close"
        /> -->
        <el-button
          v-if="!userStore.token"
          type="primary"
          plain
          @click="loginClick"
          >登录/注册</el-button
        >
        <div v-else class="userinfo">
          <el-dropdown>
            <el-avatar
              :size="30"
              :src="userStore.userInfo ? userStore.userInfo.avatar : ''"
            />
            <!-- <el-avatar></el-avatar> -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="toUserInfo">
                  <i class="iconfont icon-user-picture"></i>个人主页
                </el-dropdown-item>
                <el-dropdown-item divided @click="toSetting">
                  <i class="iconfont icon-setUp"></i>设置
                </el-dropdown-item>
                <el-dropdown-item divided @click="toManagement">
                  <el-icon><Grid /></el-icon> 管理端
                  <!-- <i class="iconfont icon-setUp"></i>管理端 -->
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <i class="iconfont icon-quit"></i>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import MyMenu from '@/components/common/menu.vue'
import { usescrollStore } from '@/stores/useScroll'
import { useUserStore } from '@/stores/userStore'
import { logout } from '@/api/login'
import { useRouter, useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chatStore'
import { flatMap } from 'lodash'

const chatStore = useChatStore()
let router = useRouter()
let route = useRoute()

let theme = ref<string>('light')
const userStore = useUserStore()
type Menu = {
  menuname: string
  path: string
  active: boolean
}

//监听路由变化显示hover active
console.log(route.fullPath)

const searchValue = ref('')

let menuList = ref<Menu[]>([
  {
    menuname: '首页',
    path: '/',
    active: true
  },
  {
    menuname: '分类',
    path: '/category',
    active: false
  },
  {
    menuname: '标签',
    path: '/span',
    active: false
  }
])

const scrollStore = usescrollStore()
const loginClick = () => {
  scrollStore.isVisibleLoginForm = true
}

const handleLogout = async () => {
  let res = await logout()
  userStore.$reset()
}

//前往个人信息页面
const toUserInfo = () => {
  let { href } = router.resolve({
    name: 'user',
    params: {
      id: userStore.userInfo.id
    }
  })
  window.open(href, '_blank')
}

//设置
const toSetting = () => {
  router.push('/settings/profile')
}

const toManagement = () => {
  window.location.href = import.meta.env.VITE_ADMIN_ADDRESS
}

const toSearch = (e: KeyboardEvent) => {
  if (e.keyCode === 13) {
    router.push({
      name: 'search',
      query: {
        query: searchValue.value
      }
    })
  }
}

const toNotification = () => {
  router.push({
    name: 'notification'
  })
}
</script>

<style scoped lang="scss">
.myheader {
  width: 100%;
  display: flex;
  background-color: var(--theme-header-bg-color);
  border-bottom: 1px solid var(--theme-border1-color);

  justify-content: center;
  .content {
    max-width: var(--content-width);
    display: flex;
    justify-content: space-between;

    height: 55px;
    color: var(--theme-text3-color);

    align-items: center;
  }

  .myheader-left {
    display: flex;
    align-items: center;
    width: 1000px;

    .logo {
      margin-right: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 30px;
        height: 30;
        margin-right: 15px;
      }
    }
  }

  .myheader-right {
    display: flex;
    width: 1000px;
    justify-content: space-evenly;
    align-items: center;

    .userinfo {
      cursor: pointer;
    }

    .search {
      .el-input {
        width: 300px;
      }
    }

    .notificationDiv {
      position: relative;

      .unreadCount {
        position: absolute;
        top: -5px;
        right: -5px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 5px;
        height: 5px;
        padding: 6px;
        color: #fff;
        font-size: 9px;
        border-radius: 50%;
        background-color: red;
        border: 1px solid #fff;
        transform: scale(0.8);
      }

      .notification {
        font-size: 24px;
        cursor: pointer;
        &:hover {
          color: #a6a2a2;
        }
      }
    }

    .backstage {
      cursor: pointer;
      &:hover {
        color: #a6a2a2;
      }
    }
  }
}
</style>
