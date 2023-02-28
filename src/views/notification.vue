<template>
  <div class="notification">
    <div class="im">
      <div class="userslist">
        <div class="searchUser">
          <el-input
            placeholder="搜索联系人"
            v-model="searchValue"
            :suffix-icon="Search"
            @keydown="toSearch"
          ></el-input>
        </div>
        <div class="list">
          <ul>
            <li
              v-for="(user, index) in filterChatList"
              :key="user.id"
              @click="handleClick(user, index)"
              :class="{ hoverlist: currentChatUser.id == user.id }"
            >
              <div class="img">
                <img :src="user.avatar" alt="" />
                <span class="count" v-show="user.count != 0">{{
                  user.count
                }}</span>
              </div>
              <div class="content">
                <div class="content_top">
                  <span>{{ user.nickName }}</span>
                  <span v-if="user.time" class="time"
                    >{{ showTimePipe(new Date(user.time)) }}
                  </span>
                </div>

                <div class="message" v-html="spanToEmjoy(user.message)"></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="chatConten">
        <div class="top">
          <span class="nickName">{{ currentChatUser.nickName }}</span>
        </div>
        <div class="chatList" ref="chatView">
          <ul v-if="chatStore.currentIndex != -1">
            <li
              v-for="(item, index) in chatStore.chatList[chatStore.currentIndex]
                .history"
              :key="item.id"
            >
              <div
                class="createTime"
                v-if="
                  isVisibleTime(
                    item.createTime,
                    chatStore.chatList[chatStore.currentIndex].history[
                      index - 1
                    ]?.createTime
                  )
                "
              >
                {{ showTimePipe(new Date(item.createTime)) }}
              </div>
              <div
                class="messageContent"
                :class="{
                  other: item.fromId == currentChatUser.id,
                  own: item.fromId != currentChatUser.id
                }"
              >
                <div class="avatar">
                  <img
                    v-if="item.fromId == currentChatUser.id"
                    :src="currentChatUser.avatar"
                    alt=""
                  />
                  <img v-else :src="userStore.userInfo.avatar" alt="" />
                </div>
                <span
                  class="newMessage"
                  v-html="spanToEmjoy(item.message)"
                ></span>
              </div>
            </li>
          </ul>
        </div>
        <div class="send">
          <div class="toolbar">
            <div class="emjoys" :class="{ visible: isVisible }">
              <span class="emjoybtn" @click="emjoybtnClick"
                ><svg-icon iconClass="表情"></svg-icon
              ></span>
              <div class="emjoyForm">
                <div class="list">
                  <div
                    class="item"
                    v-for="item in emjoys.emjoys"
                    :key="item.imgName"
                  >
                    <span>
                      <img
                        :src="item.imgUrl"
                        :alt="item.imgName"
                        @click="emjoyClick(item.imgUrl, item.imgName)"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="textarea"
            @focus="handleFocus"
            @keydown="handleEnter"
            contenteditable
            ref="commentinput"
          ></div>
          <div class="input-footer">
            <div class="desc">按 Enter 发送消息</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref, watch, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore'
import { useChatStore } from '@/stores/chatStore'
import { useRoute, useRouter } from 'vue-router'
import { userInfoByHomePage } from '@/api/user'
import { showTimePipe } from '@/utils/utils'
import emjoys from '@/assets/data/emjoy.json'
import dayjs from 'dayjs'
import { ElDropdownMenu } from 'element-plus'
const router = useRouter()
const route = useRoute()
const chatStore = useChatStore()

// chatStore.getChatUserList()
const currentChatUser = reactive({
  id: 0,
  nickName: '',
  avatar: ''
})

watch(
  () => route.query,
  async () => {
    if (route.query.participantId) {
      let participantId: any = route.query.participantId
      currentChatUser.id = participantId
      setTimeout(() => {
        chatStore.chatList.forEach((user) => {
          if (user.id == currentChatUser.id) {
            currentChatUser.nickName = user.nickName
            currentChatUser.avatar = user.avatar
          }
        })
      }, 500)

      //判断聊天列表中知否存在此用户
      const isExist = chatStore.chatList.every((item) => {
        return item.id != currentChatUser.id
      })

      //当 isExist为true为不存在 如果不存在就通过用户名查找用户

      if (isExist) {
        const res = await userInfoByHomePage(currentChatUser.id)
        console.log(res.data)
        chatStore.chatList.unshift({
          id: res.data.id,
          avatar: res.data.avatar,
          nickName: res.data.nickName,
          message: '',
          time: null,
          count: 0,
          history: []
        })
      } else {
        //设置聊天索引
        //获取和用户的聊天记录

        chatStore.getChatHistory(currentChatUser.id)
        chatStore.chatList.forEach((item, index) => {
          if (item.id == currentChatUser.id) {
            chatStore.currentIndex = index
          }
        })
      }

      chatStore.getChatHistory(currentChatUser.id)
    } else {
      chatStore.currentIndex = -1
    }
  },
  { immediate: true }
)

//判断是否显示时间
const isVisibleTime = (nowTime: Date, lastTime: Date) => {
  if (nowTime != null && lastTime != null) {
    if (new Date(nowTime).getTime() - new Date(lastTime).getTime() > 120000) {
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

//sho
let searchValue = ref('')

let filterChatList = computed(() => {
  if (searchValue.value == '' || searchValue.value == null) {
    return chatStore.chatList
  } else {
    return chatStore.chatList.filter((item) => {
      if (item.nickName.indexOf(searchValue.value) != -1) {
        return true
      } else {
        return false
      }
    })
  }
})

const userStore = useUserStore()

const toSearch = (e: KeyboardEvent) => {
  if (e.keyCode === 13) {
    console.log('')
  }
}

const handleClick = (user, index: number) => {
  router.replace({
    name: 'notification',
    query: {
      participantId: user.id
    }
  })
  chatStore.getChatHistory(user.id)
  chatStore.chatList[index].count = 0
  chatStore.currentIndex = index

  setTimeout(() => {
    scrollBottom()
  })
}

let isVisible = ref(false)

const emjoybtnClick = () => {
  isVisible.value = !isVisible.value
}

const emjoyClick = (url: string, alt: string) => {
  let imgElE = document.createElement('img')
  imgElE.setAttribute('src', url)
  imgElE.style.marginLeft = '2px'
  imgElE.setAttribute('alt', alt)
  imgElE.style.width = '16px'
  imgElE.style.height = '16px'
  imgElE.style.verticalAlign = 'text-top'
  commentinput.value.append(imgElE)
}

const handleFocus = () => {
  isVisible.value = false
}
const commentinput = ref<HTMLDivElement>(null)

interface SocketMsg {
  type: string
  fromId: number
  nickName?: string
  avatar?: string
  toId?: number
  message?: string
  createTime: Date
}

const handleEnter = (e: KeyboardEvent) => {
  if (e.code === 'Enter' && commentinput.value.innerHTML != '') {
    let message = emjoyToSpan(commentinput.value.innerHTML)

    const socketMsg: SocketMsg = {
      type: 'sendMessage',
      fromId: userStore.userInfo.id,
      nickName: userStore.userInfo.nickName,
      avatar: userStore.userInfo.avatar,
      toId: currentChatUser.id,
      message: message,
      createTime: new Date()
    }
    chatStore.sendMessage(JSON.stringify(socketMsg))
    commentinput.value.innerHTML = ''

    chatStore.chatList.forEach((item) => {
      if (item.id == socketMsg.toId) {
        item.message = socketMsg.message
        item.time = socketMsg.createTime

        if (item.history) {
          item.history.push(socketMsg)
        } else {
          item.history = []
          item.history.push(socketMsg)
        }
      }
    })

    e.stopPropagation()
    e.preventDefault()
  }

  if (e.code === 'Enter' && commentinput.value.innerHTML == '') {
    e.stopPropagation()
    e.preventDefault()
  }
}

//标签转标签
const spanToEmjoy = (message: string) => {
  const reg = /\[.+?\]/g

  return message.replace(reg, function (a, b) {
    for (let item of emjoys.emjoys) {
      if (item.imgName == a) {
        let imgElE = document.createElement('img')
        imgElE.setAttribute('src', item.imgUrl)
        imgElE.style.marginLeft = '2px'
        imgElE.setAttribute('alt', item.imgName)
        imgElE.style.width = '16px'
        imgElE.style.height = '16px'
        imgElE.style.verticalAlign = 'text-top'
        return imgElE.outerHTML
      }
    }
    return a
  })
}

//包img标签替换为对应的alt
const emjoyToSpan = (message: string) => {
  let content = message.replace(/<img(?:.|\s)*?>/gi, function (item) {
    let attrReg = /<img[^>]+alt=['"]([^'"]+)['"]+/g

    return attrReg.exec(item)[1]
  })
  return content
}

//
const chatView = ref<HTMLUListElement>(null)

const scrollBottom = () => {
  chatView.value.scrollBy({
    top: chatView.value.scrollHeight
  })
}
</script>

<style scoped lang="scss">
.notification {
  .im {
    display: flex;
    border-radius: 8px;
    width: var(--content-width);
    height: calc(100vh - 100px);
    background-color: #fff;
    margin-top: 20px;

    .userslist {
      width: 300px;
      border-right: 1px solid #e4e6eb;
      height: 100%;

      .searchUser {
        padding: 15px;
        background-color: #fff;
        border-bottom: 1px solid #e4e6eb;
        .el-input {
          height: 30px;
          &::placeholder {
            font-size: 14px;
          }
        }
        ::v-deep(.el-input__wrapper) {
          background-color: #eee;
        }
      }

      .list {
        ul {
          li {
            height: 80px;
            display: flex;
            padding: 0px 10px;
            align-items: center;
            cursor: pointer;
            &:hover {
              background: #eaf2ff;
            }
            .img {
              width: 40px;
              height: 40px;

              position: relative;

              .count {
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
            }
            img {
              border-radius: 50%;
              overflow: hidden;
              width: 100%;
              height: 100%;
            }

            .content {
              flex: 1;
              padding-left: 8px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;

              .content_top {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;

                .time {
                  font-size: 12px;
                  color: #8a919f;
                }
              }

              .newMessage {
                font-size: 13px;
                color: #8a919f;
              }
            }
          }
          .hoverlist {
            background-color: #eaf2ff;
          }
        }
      }
    }

    .chatConten {
      flex: 1;
      .top {
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #e4e6eb;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .chatList {
        box-sizing: border-box;
        height: calc(100% - 210px);
        overflow-y: scroll;
        padding: 10px;

        .createTime {
          display: flex;
          justify-content: center;
          margin: 10px 0;
          font-size: 12px;
          color: #8a919f;
        }

        .other {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          span {
            margin-left: 5px;
            display: inline-block;
            padding: 10px 12px;
            border-radius: 5px;
            background-color: #e4e6eb;
          }
          .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }

        .own {
          margin-bottom: 20px;
          display: flex;
          justify-content: end;
          flex-direction: row-reverse;
          align-items: center;
          span {
            margin-right: 5px;
            display: inline-block;
            padding: 10px 12px;
            border-radius: 5px;
            background-color: #e4e6eb;
          }
          .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      .send {
        position: relative;
        width: 100%;
        height: 150px;
        border-top: 1px solid #e4e6eb;

        .toolbar {
          display: flex;
          align-items: center;

          width: 100%;
          height: 42px;

          .emjoybtn {
            font-size: 18px;
            margin-left: 14px;
          }
        }

        .textarea {
          font-size: 14px;
          color: #252933;
          flex: 1 1 0%;
          width: 100%;
          height: 110px;
          resize: none;
          border: none;
          outline: none;
          padding: 0px 20px;
          box-sizing: border-box;
        }

        .desc {
          position: absolute;
          bottom: 10px;
          right: 10px;
          font-size: 14px;
          color: #c2c8d1;
        }
      }
    }
  }
}

.emjoyForm {
  display: none;
  position: absolute;
  top: -290px;
  left: 0;
  background: #fff;
  box-shadow: 0 8px 24px rgb(0 0 0 / 16%);
  border-radius: 2px;
  width: 416px;
  padding-top: 10px;

  &::after {
    content: '';
    width: 12px;
    height: 12px;
    background-color: inherit;
    position: absolute;
    left: 15px;
    top: 285px;
    transform: rotate(135deg);
  }

  .list {
    padding-left: 12px;
    padding-bottom: 12px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 270px;
    overflow-y: scroll;
    user-select: none;
    .item {
      position: relative;
      width: 32px;
      height: 32px;
      margin-bottom: 8px;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      span {
        /* color: #515767;
    font-size: 13px; */

        img {
          transform: translateZ(0);
          transition: transform 0.3s;
          display: block;
          height: 28px;

          &:hover {
            transform: scale(1.3);
          }
        }
      }
    }
  }
}

.visible {
  .emjoybtn {
    color: var(--theme-text5-color);
  }
  .emjoyForm {
    display: block;
  }
}
</style>
