import { chatUserList, chatHistory } from '@/api/im'

import { defineStore } from 'pinia'
import { useUserStore } from './userStore'

interface SocketMsg {
  type: string
  fromId: number
  nickName?: string
  avatar?: string
  toId?: number
  message?: string
  createTime: string
}

export const useChatStore = defineStore('chat', {
  state: () => {
    return {
      chatList: [],
      chatHistoryList: [],
      websocket: null,
      timeout: 28 * 1000, //30秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null, //断开 重连倒计时
      lockReconnect: false,
      currentIndex: -1 //当前聊天显示的用户聊天的索引 ，如果是-1 表示不在聊天界面
    }
  },
  getters: {
    unreadCount() {
      const allCount = 0
      // if (this.chatList.length <= 0) return 0
      // allCount = this.chatList.reduce((pre, current) => {
      //   return pre + current.count
      // }, 0)

      return allCount
    }
  },
  actions: {
    connectSocket() {
      //判断是否登录

      const userStore = useUserStore()
      const userId = userStore.userInfo.id
      if ('WebSocket' in window && userStore.token) {
        this.websocket = new WebSocket(
          'ws://localhost:7777/websocket/' + userId
        )

        // 连接错误
        this.websocket.onerror = this.setErrorMessage

        // 连接成功
        this.websocket.onopen = this.setOnopenMessage

        // 收到消息的回调
        this.websocket.onmessage = this.setOnmessageMessage

        // 连接关闭的回调
        this.websocket.onclose = this.setOncloseMessage

        // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = this.onbeforeunload
      }
    },
    reconnect() {
      //重新连接
      if (this.lockReconnect) return
      this.lockReconnect = true
      this.timeoutnum && clearTimeout(this.timeoutnum)
      this.timeoutnum = setTimeout(() => {
        this.connectSocket()
        this.lockReconnect = false
      }, 5000)
    },
    reset() {
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      this.start()
    },
    start() {
      this.timeoutObj && clearTimeout(this.timeoutObj)
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
      this.timeoutObj = setTimeout(() => {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (this.websocket && this.websocket.readyState == 1) {
          // 如果连接正常
          this.sendMessage(JSON.stringify({ type: 'heartbeat' }))
        } else {
          // 否则重连
          this.reconnect()
        }
        this.serverTimeoutObj = setTimeout(() => {
          //超时关闭
          this.websocket.close()
        }, this.timeout)
      }, this.timeout)
    },
    sendMessage(msg: string) {
      this.websocket.send(msg)
    },
    setOnmessageMessage(event) {
      const obj: SocketMsg = JSON.parse(event.data)

      switch (obj.type) {
        case 'heartbeat':
          //收到服务器信息，心跳重置
          this.reset()
          break
        case 'sendMessage':
          this.setChatList(obj)
        // this.data = obj.data
        // this.chatHistoryList.push({ fromId: obj.userId, message: obj.msg })
        /**
         * 刷新未读数据
         */
      }
    },
    setErrorMessage() {
      //重连
      this.reconnect()
      console.log(
        'WebSocket连接发生错误' + '   状态码：' + this.websocket.readyState
      )
    },
    setOnopenMessage() {
      //开启心跳
      this.start()
      console.log(
        'WebSocket连接成功' + '   状态码：' + this.websocket.readyState
      )
    },
    setOncloseMessage() {
      //重连
      this.reconnect()
      console.log(
        'WebSocket连接关闭' + '   状态码：' + this.websocket.readyState
      )
    },
    onbeforeunload() {
      this.closeWebSocket()
    },
    closeWebSocket() {
      // 关闭websocket
      this.websocket.close()
    },
    async getChatHistory(toId) {
      //获取当前聊天列表
      const res = await chatHistory(toId)

      this.chatList.forEach((item) => {
        if (item.id == toId) {
          item['history'] = [...res.data]
        }
      })

      this.chatHistoryList = res.data
    },
    setChatList(obj: SocketMsg) {
      let isExist = false
      //先判断存不存在
      this.chatList.forEach((item, index) => {
        if (item.id == obj.fromId) {
          isExist = true
          //如有有
          item.avatar = obj.avatar
          item.nickName = obj.nickName
          item.message = obj.message
          item.time = obj.createTime

          //如果是当前正在聊天窗口
          if (index == this.currentIndex) {
            item.count = 0
            // item.count++
            // //一秒钟后清楚红点
            // setTimeout(() => {
            //   item.count = 0
            // }, 1000)
          } else {
            item.count++
          }

          if (item.history) {
            item.history.push(obj)
          } else {
            item.history = []
            item.history.push(obj)
          }
        }
      })
      if (!isExist) {
        //不存在相同的用户
        this.chatList.push({
          id: obj.fromId,
          avatar: obj.avatar,
          nickName: obj.nickName,
          message: obj.message,
          time: obj.createTime,
          count: 1,
          history: [obj]
        })
      }
    },
    /**
     * 获取用户聊天列表
     */
    async getChatUserList() {
      const res = await chatUserList()
      this.chatList = res.data
      // console.log(this.chatList)
    }
  }
})
