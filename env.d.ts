/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_ADDRESS: string //定义提示信息 数据是只读的无法被修改 //多个变量定义多个...
  readonly VITE_WS_ADDRESS: string
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  //eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
