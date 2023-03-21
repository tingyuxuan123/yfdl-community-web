//emailReg

export const emailReg = (email: string): boolean => {
  //Email正则
  const ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  //输出 true

  return ePattern.test(email)
}
