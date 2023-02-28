import request from '@/utils/request'

export const chatUserList = () => {
  return request(`/im/chatUserList`, 'get')
}

export const chatHistory = (toId: number) => {
  return request(`/im/chatHistory`, 'get', {
    toId
  })
}
