<template>
  <div class="home">
    <my-content>
      <template #left>
        <entry-list-container></entry-list-container>
      </template>
      <template #right>
        <myaside>
          <template #default>
            <web-site-info></web-site-info>
            <aside-item class="hotarticle">
              <template #header> <h3>热门文章</h3> </template>
              <template #content>
                <hot-article-list></hot-article-list>
              </template>
            </aside-item>
          </template>
        </myaside>
      </template>
    </my-content>
  </div>
</template>

<script lang="ts" setup name="home">
import { reactive, ref } from 'vue'
import MyContent from '@/components/MyContent.vue'
import EntryListContainer from '@/components/entry/EntryListContainer.vue'
import myaside from '../components/aside/aside.vue'
import WebSiteInfo from '@/components/home/WebSiteInfo.vue'
import asideItem from '@/components/aside/asideItem.vue'
import HotArticleList from '@/components/home/HotArticleList.vue'
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
}

.hotarticle {
  width: 275px;
  margin-top: 15px;
}
</style>
