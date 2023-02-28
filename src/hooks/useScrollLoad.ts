import { onMounted, onUnmounted } from 'vue'

export default function (fun: () => void) {
  onMounted(() => {
    window.addEventListener('scroll', handleScroll, true)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  const handleScroll = (event: Event) => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop

    // 屏幕可视区域高度
    const clientHeight = document.documentElement.clientHeight
    //浏览器所有内容高度
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight + 10 >= scrollHeight) {
      fun()
    }
  }
}
