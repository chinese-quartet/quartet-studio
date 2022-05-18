<template>
  <a-row class="card-list" :gutter="16">
    <a-col :xxl="6" :xl="8" :lg="8" :md="8" :sm="12" :xs="24" v-for="(app, idx) in appList" :key="idx">
      <a-card hoverable class="card">
        <!-- <img :alt="app.title" :src="app.cover" slot="cover"/> -->
        <template class="ant-card-actions" slot="actions">
          <a-button @click="onView(app)"> <a-icon type="eye" /> Run </a-button>
          <a-button @click="openLink(app)"> <a-icon type="question-circle" /> Help </a-button>
          <a-button disabled> <a-icon type="share-alt" /> Share </a-button>
        </template>
        <a-card-meta :title="app.title" class="card-meta">
          <p slot="description">
            <a-tag color="#108ee9">{{ formatAppVersion(app) }}</a-tag>
            <span>{{ app.description }}</span>
          </p>
          <!-- <a-avatar slot="avatar" :src="app.icon" /> -->
          <a-avatar slot="avatar" style="background-color: #87d068">
            {{ app.title[0].toUpperCase() }}
          </a-avatar>
        </a-card-meta>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { projectSettings } from '@/config/defaultSettings'

const helps = projectSettings.helps

/* eslint-disable */
export default {
  name: 'AppList',
  props: {
    appList: {
      required: true,
      type: Array,
    },
    appCategory: {
      required: true,
      type: String,
    },
  },
  methods: {
    formatAppVersion(app) {
      if (app.appName) {
        return app.appName.split('-').pop()
      } else {
        return app.version ? app.version : 'latest'
      }
    },
    openLink(app) {
      if (app.shortName == 'upload-data') {
        let help = helps['upload-data']
        let helpLink = help[this.appCategory]
        console.log('Upload Data: ', helps, helpLink)
        if (helpLink) {
          window.open(helpLink, '_blank')
        }
      } else {
        let helpLink = helps[app.shortName]
        if (helpLink) {
          // TODO: Redirect to the specified help page
          window.open(helpLink, '_blank')
        } else {
          window.open(helps['home'], '_blank')
        }
      }
    },
    onView(app) {
      if (app.category === 'LocalTool') {
        this.$router.push({
          name: app.shortName,
        })
      } else if (app.category === 'Report') {
        this.$router.push({
          name: app.shortName,
        })
      } else if (app.category === 'Pipeline') {
        this.$router.push({
          name: app.shortName,
        })
        // this.$router.push({
        //   name: 'create-project',
        //   query: {
        //     appId: app.id
        //   }
        // })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.card-list {
  margin-left: 0px !important;
  margin-right: 0px !important;

  .card {
    width: 100%;
    margin: 0px 0px 10px;

    img {
      height: 200px;
    }

    .card-meta {
      height: 75px;
    }
  }
}
</style>
