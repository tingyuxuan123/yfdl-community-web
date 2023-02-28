import request from '@/utils/request'

export const categoryList = () => {
  return request('/category/getAllCategoryList', 'get')
}
