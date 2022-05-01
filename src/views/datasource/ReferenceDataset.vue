<template>
  <a-row class="reference-datasets-container">
    <a-list item-layout="vertical" size="large" :data-source="currentVersion">
      <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
        <template slot="actions">
          <a-dropdown trigger="click">
            <a @click.prevent>
              <a-icon type="cloud-download"></a-icon> Stable Versions
            </a>
            <a-menu
              slot="overlay"
              @click="
                (e) => {
                  fetchHelp(item.category, e.key)
                }
              "
            >
              <a-menu-item v-for="versionKey in versionKeys" :key="versionKey"> {{ versionKey }} </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-button style="padding: 0px 5px" type="link" icon="cloud-download" @click="redirectDevelopmentSite">
            Development Versions
          </a-button>
          <a-button style="padding: 0px 5px" type="link" icon="github" @click="redirectGithub"> Github Repo </a-button>
        </template>
        <img slot="extra" width="400" alt="logo" :src="item.graphical_abstract" />
        <a-list-item-meta :description="item.summary">
          <a slot="title" @click="fetchHelp(item.category, currentVersionKey)">
            {{ item.title }}
            <a-tooltip>
              <template slot="title">
                We will release a stable version of the reference dataset every six months to a year, and will provide
                all versions of the historical reference dataset, you can download the specified version via the
                drop-down menu below. The development version of the reference dataset will be updated from time to
                time, if you are interested in this, you can get it from the link below.
              </template>
              <a-icon type="question-circle" />
            </a-tooltip>
          </a>
          <a-avatar slot="avatar" :src="item.avatar" />
        </a-list-item-meta>
        {{ item.description }}
      </a-list-item>
    </a-list>
    <a-modal
      :title="helpTitle"
      width="60%"
      class="help-markdown"
      :visible="helpVisible"
      :footer="null"
      @cancel="closeHelp"
    >
      <a-row class="markdown">
        <vue-markdown :source="helpMsg" @rendered="update"></vue-markdown>
      </a-row>
    </a-modal>
  </a-row>
</template>

<script>
import filter from 'lodash.filter'
import axios from 'axios'
import VueMarkdown from 'vue-markdown'
import Prism from 'prismjs'

const REFERENCE_DATASET_URL = '//reference-datasets.chinese-quartet.org'
const MANIFEST_URL = REFERENCE_DATASET_URL + '/stable/manifest.json'
const DEVELOP_BRANCH = REFERENCE_DATASET_URL + '/index.html?prefix=develop/'
const GITHUB = 'https://github.com/chinese-quartet'

// Example:
// {
//   category: 'DNA',
//   avatar: 'https://reference-datasets.chinese-quartet.org/images/genomics.png',
//   title: 'Reference Datasets for DNA',
//   summary: 'Reference datasets could be used as "ground truth" to evaluate the accuracy of DNA-seq experiments.',
//   description:
//     'The Quartet DNA reference datasets are provided as a variant call file (vcf) that contains the high-confidence SNVs, small indels (less than 50 bp), and structural variants (insertions and deletion over than 50 bp), as well as a tab-delimited "bed" file that describes the high-confidence bed regions, using methods described in the Quartet DNA manuscript. The v20210909 of DNA reference datasets covers approximately 87.8% of the GRCh38 assembly (https://gdc.cancer.gov/about-data/gdc-data-processing/gdc-reference-files). As sequencing technologies and analysis methods improve, the reference datasets will be updated periodically.',
//   graphical_abstract: 'https://reference-datasets.chinese-quartet.org/images/dna-reference-datasets-overview.png',
//   markdown: 'https://reference-datasets.chinese-quartet.org/stable/v20210909/DNA/README.md'
// }

export default {
  components: {
    VueMarkdown
  },
  data() {
    return {
      currentVersion: [],
      currentVersionKey: '',
      versionKeys: [],
      versions: {},
      helpVisible: false,
      helpMsg: '',
      helpTitle: ''
    }
  },
  methods: {
    closeHelp() {
      this.helpVisible = false
    },
    update() {
      this.$nextTick(() => {
        Prism.highlightAll()
      })
    },
    getVersion(data, versionKey) {
      const vs = filter(data, o => {
        return o.version == versionKey
      })

      if (vs.length > 0) {
        return vs[0]
      } else {
        return null
      }
    },
    fetchHelp(category, versionKey) {
      console.log('Fetch Help: ', category, versionKey)
      const version = this.getVersion(this.versions[category], versionKey)

      if (version) {
        const markdown = version.markdown
        this.helpTitle = version.title

        axios
          .get(markdown)
          .then(response => {
            console.log('Fetch Help: ', response)
            this.helpMsg = response.data
          })
          .catch(error => {
            console.log('Fetch Help Error: ', error)
            this.helpMsg = 'No Content.'
          })
          .finally(() => {
            this.helpVisible = true
          })
      }
    },
    redirect(url) {
      window.open(url, '_blank')
    },
    redirectGithub() {
      this.redirect(GITHUB)
    },
    redirectDevelopmentSite(e) {
      this.redirect(DEVELOP_BRANCH)
    },
    makeVersions(data, versionKeys) {
      const versions = {}
      for (let version of versionKeys) {
        const listData = data[version]
        for (let item of listData) {
          item['version'] = version
          let temp = versions[item['category']]

          if (temp) {
            temp.push(item)
          } else {
            versions[item['category']] = [item]
          }
        }
      }

      return versions
    },
    fetchManifest(url) {
      axios.get(url).then(response => {
        const manifests = response.data
        // DESC
        this.versionKeys = Object.keys(manifests)
          .sort()
          .reverse()
        // Get the latest version
        this.currentVersionKey = this.versionKeys[0]
        this.currentVersion = manifests[this.currentVersionKey]
        this.versions = this.makeVersions(manifests, this.versionKeys)
      })
    }
  },
  created() {
    this.fetchManifest(MANIFEST_URL)
  }
}
</script>

<style lang="less">
.reference-datasets-container {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  height: 100%;
  overflow: scroll;

  .ant-list-item-extra {
    margin-left: 0px;
  }

  .ant-list-item-main {
    text-align: justify;
    margin-right: 15px;
  }

  .ant-avatar {
    width: 64px;
    height: 64px;
  }
}

.help-markdown {
  .ant-modal-body {
    height: 450px;

    .markdown {
      height: 100%;
      overflow: scroll;
    }

    .markdown::-webkit-scrollbar {
      width: 0 !important;
    }
  }
}
</style>