<template>
  <div class="dashboard-container">
    <a-row :gutter="24" style="margin: 0px 0px 10px">
      <a-card :loading="loading" title="Request Materials">
        <p style="margin-bottom: 10px; text-align: justify" v-html="description"></p>
        <fact :factData="factData" @select-item="selectPDF"></fact>
        <a-button icon="question-circle" slot="extra" @click="redirectHelp">Need Help</a-button>
      </a-card>
    </a-row>

    <a-row :gutter="24" style="margin: 0px 0px 10px">
      <a-card :loading="loading" title="Materials Specification">
        <a-tabs class="specification" v-model="currentTab" animated @change="selectPDF">
          <a-tab-pane
            v-for="item in materialsDetails"
            :key="item.key"
            :tab="item.title"
            :disabled="item.pdfUrl.length === 0"
          >
            <pdf-viewer height="600px" :url="item.pdfUrl"></pdf-viewer>
          </a-tab-pane>
        </a-tabs>
        <a-button icon="question-circle" slot="extra" @click="redirectHelp">Need Help</a-button>
      </a-card>
    </a-row>
  </div>
</template>

<script>
import { PdfViewer } from '@/components'
import Fact from './Fact.vue'

export default {
  name: 'Analysis',
  components: {
    PdfViewer,
    Fact
  },
  data() {
    return {
      loading: false,
      description:
        'Quartet DNA, RNA, Protein, and Metabolite reference materials were generated simultaneously ' +
        'from the same set of EBV immortalized lymphoblast cell lines (LCLs) including father (Quartet_F7), ' +
        'mother (Quartet_M8), and two monozygotic twin daughters (Quartet_D5 and Quartet_D6). ' +
        'These reference materials will benefit the quality control and standardization of large-scale, longitudinal, cross-lab, and cross-platform cohort studies. ' +
        '<b>To promote the healthy development of the whole field, all Quartet reference materials will be open for use free of charge under the premise of complying with relevant national laws and regulations.</b> ' +
        'Please click the <b style="color: #108ee9;">Request</b> button to request the materials, if you would like to use these materials. ' +
        'After we reciving your request, we will contact you to confirm the delivery of the Quartet Referece Materials. ' +
        '<a href="https://www.yuque.com/quartet/help?language=en-us">More details</a>',
      pdfViewerVisible: false,
      materialsDetails: [
        {
          key: 'dna',
          pdfUrl:
            'http://nordata-cdn.oss-cn-shanghai.aliyuncs.com/20181212_ZhengYuanting_Quartet_DNA_Processing_and_Sequence_Data_Reporting_Overview_Sop.pdf',
          title: 'DNA Materials'
        },
        {
          key: 'rna',
          pdfUrl:
            'http://nordata-cdn.oss-cn-shanghai.aliyuncs.com/Quartet_RNA_Processing_and_Sequence_Data_Reporting_Overview_Sop_v20200518.pdf',
          title: 'RNA Materials'
        },
        {
          key: 'protein',
          pdfUrl: '',
          title: 'Protein Materials'
        },
        {
          key: 'metabolite',
          pdfUrl: '',
          title: 'Metabolite Materials'
        }
      ],
      currentTab: 'dna',
      factData: [
        {
          key: 'dna',
          name: 'DNA',
          image: '',
          requestTubes: '50',
          generatedData: '10'
        },
        {
          key: 'rna',
          name: 'RNA',
          image: '',
          requestTubes: '60',
          generatedData: '10'
        },
        {
          key: 'protein',
          name: 'Protein',
          image: '',
          requestTubes: '5',
          generatedData: '10'
        },
        {
          key: 'metabolite',
          name: 'Metabolite',
          image: '',
          requestTubes: '5',
          generatedData: '20'
        }
      ]
    }
  },
  methods: {
    requestMaterials() {
      this.$router.push({
        name: 'request-materials'
      })
    },
    selectPDF(pdfKey) {
      this.currentTab = pdfKey
    },
    redirectHelp() {
      window.open('https://www.yuque.com/quartet/help?language=en-us', '__blank')
    }
  },
  created() {}
}
</script>

<style lang="less">
.dashboard-container {
  .ant-card {
    .ant-card-head {
      padding: 0 16px;
    }

    .ant-card-body {
      padding: 10px 16px;
    }

    .ant-card-actions {
      background: unset;
      border-top: unset;
    }

    .ant-card-actions > li:not(:last-child) {
      border-right: unset;
    }

    .ant-card-actions > li > span {
      height: 32px;
      line-height: 32px;
    }

    .ant-card-actions > li {
      margin: 0px 0px 12px 0px;
    }
  }
}
</style>