<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <a-row class="lang-panel" v-if="false">
      <lang-select />
    </a-row>
    <div class="container">
      <div class="top">
        <div class="header">
          <router-link :to="{ name: 'dashboard' }">
            <img :src="websiteLogo" class="logo" alt="logo" />
            <!-- <span class="title">{{ websiteName }}</span> -->
          </router-link>
        </div>
        <div class="desc">
          {{ websiteDesc }}
        </div>
      </div>

      <route-view></route-view>

      <div class="footer">
        <div class="links">
          <a :href="policyEntrypoint" target="_blank">{{ $t('layouts.userLayout.dataPolicies') }}</a>
          <a :href="helpEntrypoint" target="_blank">{{ $t('layouts.userLayout.help') }}</a>
          <a-dropdown>
            <a>{{ $t('layouts.userLayout.feedback') }}</a>
            <a-menu slot="overlay">
              <!-- No zh_CN  -->
              <a-menu-item v-if="false">
                <a :href="feedbackEntrypoint.zh_CN" target="_blank">
                  <span class="action"> 🇨🇳 讨论区 </span>
                </a>
              </a-menu-item>
              <a-menu-item>
                <a :href="feedbackEntrypoint.en_US" target="_blank">
                  <span class="action"> 🇬🇧 Issues </span>
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <!-- <a href="_self" target="_blank">{{ $t('layouts.userLayout.terms') }}</a> -->
        </div>
        <div class="copyright">{{ $t('layouts.userLayout.copyright') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import RouteView from './RouteView'
import { mixinDevice } from '@/utils/mixin'
import { mapGetters } from 'vuex'
import { websiteDesc, websiteLogo, websiteName } from '@/config/defaultSettings'
import LangSelect from '@/components/Tools/LangSelect'

export default {
  name: 'UserLayout',
  components: { RouteView, LangSelect },
  computed: {
    ...mapGetters(['feedbackEntrypoint', 'policyEntrypoint', 'helpEntrypoint'])
  },
  mixins: [mixinDevice],
  data() {
    return {
      websiteDesc,
      websiteLogo,
      websiteName
    }
  },
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .lang-panel {
    position: absolute;
    top: 20px;
    right: 30px;
    z-index: 10;
  }

  .lang-panel:hover {
    cursor: pointer;
  }

  .container {
    width: 100%;
    min-height: 100%;
    background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
    background-size: 100%;
    padding: 110px 0 144px;
    position: relative;

    a {
      text-decoration: none;
    }

    .top {
      text-align: center;

      .header {
        height: 64px;
        line-height: 64px;

        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 84px;
          vertical-align: top;
          margin-right: 16px;
          border-style: none;
        }

        .title {
          font-size: 33px;
          color: rgba(0, 0, 0, 0.85);
          font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }

      .desc {
        font-size: 18px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 32px;
        margin-bottom: 20px;
      }
    }

    .main {
      min-width: 260px;
      width: 368px;
      margin: 0 auto;
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
      .copyright {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  }
}
</style>
