import request from '@/utils/request'

export const tagList = (params: any) => {
  return request('/tag/queryTagListByParams', 'get', { ...params })
}

export const tagInfoById = (tagId: number) => {
  return request('/tag/tagInfoById', 'get', {
    tagId
  })
}
