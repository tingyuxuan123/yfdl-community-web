import request from '@/utils/request'

export const searchArticle = (params: any) => {
  return request('/article/searchArticle', 'get', {
    ...params
  })
}

export const searchUser = (params: any) => {
  return request('/user/searchUser', 'get', { ...params })
}
