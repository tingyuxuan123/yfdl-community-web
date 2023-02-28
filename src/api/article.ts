import request from '@/utils/request'

export const articleList = (queryParams: any, pageinfo: any) => {
  return request('/article/articleList', 'get', {
    ...queryParams,
    ...pageinfo
  })
}

export const articleListByUserId = (
  createBy: number,
  queryParams: any,
  pageinfo: any
) => {
  return request('/article/articleList', 'get', {
    userId: createBy,
    ...queryParams,
    ...pageinfo
  })
}

export const articleDetail = (id: string) => {
  return request(`/article/${id}`, 'get')
}

export const updateViewCount = (id: string) => {
  return request(`/article/updateViewCount/${id}`, 'put')
}

export const articleListByUserLikes = (userId: number) => {
  return request('/article/articleListByUserLikes', 'get', {
    userId
  })
}

export const articleListByRecommended = (pageinfo: any) => {
  return request('/article/articleListByRecommended', 'get', {
    ...pageinfo
  })
}

export const articleListByNew = (pageinfo: any) => {
  return request('/article/articleListByNew', 'get', {
    ...pageinfo
  })
}

export const articleListByDynamic = (pageinfo: any) => {
  return request('/article/articleListByDynamic', 'get', {
    ...pageinfo
  })
}

export const articeListbyTag = (pageinfo: any) => {
  return request('/article/articeListbyTag', 'get', {
    ...pageinfo
  })
}

export const articleListByCollection = (pageinfo: any) => {
  return request('/article/articleListByCollection', 'get', {
    ...pageinfo
  })
}

export const hotArticleList = () => {
  return request('/article/hotArticleList', 'get')
}

export const articleAndCommentCountInfo = () => {
  return request('/article/articleAndCommentCountInfo', 'get')
}

export const articleListByRelated = (articleTitle: string) => {
  return request('/article/articleListByRelated', 'get', {
    articleTitle
  })
}
export const articleListByCategoryId = (pageinfo: any) => {
  return request('/article/articleListByCategoryId', 'get', {
    ...pageinfo
  })
}
