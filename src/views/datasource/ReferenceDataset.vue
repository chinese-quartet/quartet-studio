<template>
  <a-row class="reference-datasets-container">
    <a-list item-layout="vertical" size="large" :data-source="listData">
      <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
        <template slot="actions">
          <a-button type="primary" icon="cloud-download" @click="fetchHelp(item.datasetType)">Download</a-button>
        </template>
        <img slot="extra" width="400" alt="logo" :src="item.image" />
        <a-list-item-meta :description="item.description">
          <a slot="title" @click="fetchHelp(item.datasetType)">{{ item.title }}</a>
          <a-avatar slot="avatar" :src="item.avatar" />
        </a-list-item-meta>
        {{ item.content }}
      </a-list-item>
    </a-list>
    <a-modal :title="helpTitle" width="60%" class="help-markdown" :visible="helpVisible" :footer="null" @cancel="closeHelp">
      <a-row class="markdown">
        <vue-markdown :source="helpMsg" @rendered="update"></vue-markdown>
      </a-row>
    </a-modal>
  </a-row>
</template>

<script>
import v from 'voca'
import axios from 'axios'
import VueMarkdown from 'vue-markdown'
import Prism from 'prismjs'

export default {
  components: {
    VueMarkdown
  },
  data() {
    return {
      listData: [
        {
          image:
            'http://www.rainsurebio.com/qfy-content/uploads/2020/03/dca143037912404bfc097f509af837c4-e1584692168980-1024x429.jpg',
          datasetType: 'genomics',
          title: 'Reference Dataset for Genomics',
          avatar: require('@/assets/images/genomics.png'),
          description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
        },
        {
          image:
            'http://www.rainsurebio.com/qfy-content/uploads/2020/03/dca143037912404bfc097f509af837c4-e1584692168980-1024x429.jpg',
          datasetType: 'transcriptomics',
          title: 'Reference Dataset for Transcriptomics',
          avatar: require('@/assets/images/transcriptomics.png'),
          description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
        },
        {
          image:
            'http://www.rainsurebio.com/qfy-content/uploads/2020/03/dca143037912404bfc097f509af837c4-e1584692168980-1024x429.jpg',
          datasetType: 'proteomics',
          title: 'Reference Dataset for Proteomics',
          avatar: require('@/assets/images/proteomics.png'),
          description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
        },
        {
          image:
            'http://www.rainsurebio.com/qfy-content/uploads/2020/03/dca143037912404bfc097f509af837c4-e1584692168980-1024x429.jpg',
          datasetType: 'metabolomics',
          title: 'Reference Dataset for Metabolomics',
          avatar: require('@/assets/images/metabolomics.png'),
          description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
        }
      ],
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
    fetchHelp(datasetType) {
      this.helpTitle = 'Download ' + v.titleCase(datasetType) + ' Reference Dataset'

      axios
        .get(`/docs/${datasetType}.md`)
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
    },
  },
  created() {}
}
</script>

<style lang="less">
.reference-datasets-container {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  height: 100%;

  .ant-list-item-extra {
    margin-left: 0px;
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