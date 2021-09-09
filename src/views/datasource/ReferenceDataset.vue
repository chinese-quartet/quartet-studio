<template>
  <a-row class="reference-datasets-container">
    <a-list item-layout="vertical" size="large" :data-source="listData">
      <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
        <template slot="actions">
          <a-button type="primary" icon="cloud-download" @click="fetchHelp(item.markdown, item.title)">Download</a-button>
        </template>
        <img slot="extra" width="400" alt="logo" :src="item.image" />
        <a-list-item-meta :description="item.description">
          <a slot="title" @click="fetchHelp(item.markdown, item.title)">{{ item.title }}</a>
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
          title: 'Reference Datasets for DNA',
          avatar: require('@/assets/images/genomics.png'),
          description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
        },
        {
          image: require('@/assets/images/rna-reference-datasets-overview.png'),
          title: 'Reference Datasets for RNA',
          avatar: require('@/assets/images/transcriptomics.png'),
          description: 'Reference datasets could be used as "ground truth" to evaluate the accuracy of RNA-seq experiments.',
          content: 'Based on high-quality of multi-lab RNA-seq libraries, we have reached consensuses on the characterization of gene expression at relative level as reference datasets, and established performance metrics for proficiency test. We used expression profiles from 16 hiqh-quality RNA-seq batches to construct reference datasets (Figure 1). Of the 58,395 genes annotated in GRCh38.93, 10,067 (17.2%) for D6/D5, 11,560 (19.8 %) for F7/D5, 8,081 (13.8%) for F7/D6, 12,104 (20.7%) for M8/D5, 9,363 (16.0%) for M8/D6, and 10,401 (17.8%) for M8/F7 were determined as reference datasets. Moreover, the numbers of reference DEGs ranged from 1,617 to 3,044 for the six pairs of sample groups.',
          markdown: '/markdown/rna-reference-datasets.md'
        },
        {
          image:
            'http://www.rainsurebio.com/qfy-content/uploads/2020/03/dca143037912404bfc097f509af837c4-e1584692168980-1024x429.jpg',
          title: 'Reference Dataset for Proteomics',
          avatar: require('@/assets/images/proteomics.png'),
          description: 'Ant Design, a design language for background applications, is refined by Ant UED Team.',
          content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'
        },
        {
          image:
            'http://www.rainsurebio.com/qfy-content/uploads/2020/03/dca143037912404bfc097f509af837c4-e1584692168980-1024x429.jpg',
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
    fetchHelp(markdown, title) {
      this.helpTitle = title

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