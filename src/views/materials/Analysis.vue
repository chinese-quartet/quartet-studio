<template>
  <div class="dashboard-container">
    <a-row :gutter="24" style="margin: 0px 0px 10px">
      <a-card :loading="loading" title="Reference Materials">
        <p style="margin-bottom: 10px; text-align: justify" v-html="description"></p>
        <fact :factData="factData" @select-item="selectPDF"></fact>
        <a-button icon="question-circle" slot="extra" @click="redirectHelp">Help</a-button>
      </a-card>
    </a-row>
    <img class="btn-twinkle" @click.stop="selectPDF('dna')" :src="require('@/assets/images/arrow-bottom.png')" />
    <a-row :gutter="24" style="margin: 0px 0px" id="specification-container">
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
        <a-button icon="question-circle" slot="extra" @click="redirectHelp">Help</a-button>
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
        'Quartet multi-omics reference materials of DNA, RNA, proteins, and metabolites were simultaneously ' +
        'manufactured from the same batch of cultured immortalized B-lymphoblastoid cell line of a specific family member ' +
        'of a Chinese Quartet family from Fudan Taizhou Cohort, including father (F7), mother (M8), and two monozygotic ' +
        'twin daughters (D5 and D6). The Quartet Reference Materials suite is intended for quality control and performance ' +
        'assessment of each omics profiling. It can measure and mitigate technical variation, enabling more accurate data ' +
        'integration in large cohort studies. The Quartet multi-omics reference materials are publicly available and accessible. ' +
        '<b>The recipients of the Reference Materials are highly encouraged to share their data with Fudan University through ' +
        'the Quartet Data Portal in order for us to improve the reference datasets and to better serve the community.</b>',
      pdfViewerVisible: false,
      materialsDetails: [
        {
          key: 'dna',
          pdfUrl: '/pdf/Quartet_DNA_Manual_v20210908.pdf',
          title: 'DNA Materials'
        },
        {
          key: 'rna',
          pdfUrl: '/pdf/Quartet_RNA_Manual_v20210908.pdf',
          title: 'RNA Materials'
        },
        {
          key: 'protein',
          pdfUrl: '/pdf/Quartet_Protein_Manual_v20210908.pdf',
          title: 'Protein Materials'
        },
        {
          key: 'metabolite',
          pdfUrl: '/pdf/Quartet_Metabolite_Manual_v20210908.pdf',
          title: 'Metabolite Materials'
        }
      ],
      currentTab: 'dna',
      factData: [
        {
          key: 'dna',
          name: 'DNA',
          image: '',
          specification:
            'Each vial contains approximately 10 μg of genomic DNA (200 ng/μL, 50 μL) in TE buffer (10 mM TRIS, 1 mM EDTA, pH 8.0)'
        },
        {
          key: 'rna',
          name: 'RNA',
          image: '',
          specification:
            'Each vial contains approximately 5 μg of total RNA (~520 ng/μL, 10 μL), and the RNA is in water. miRNA and other small RNA are retained.'
        },
        {
          key: 'protein',
          name: 'Protein',
          image: '',
          specification:
            'Each vial contains approximately 10 μg of dried, tryptic peptide mixtures. Four labeled peptides are spiked in at different weight ratios as external controls.'
        },
        {
          key: 'metabolite',
          name: 'Metabolite',
          image: '',
          specification:
            'Each vial contains dried cell extracts from approximately 106 cells using methanol / water (6/1) solution. Eleven external controls are spiked in at known amounts.'
        }
      ]
    }
  },
  methods: {
    selectPDF(pdfKey) {
      this.currentTab = pdfKey
      document.getElementById('specification-container').scrollIntoView({ behavior: 'smooth' })
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

  @keyframes heartAnimate {
    0%,
    100% {
      transform: scale(1) rotate(0);
    }

    10%,
    30% {
      transform: scale(0.9) rotate(2deg);
    }

    20%,
    40%,
    60%,
    80% {
      transform: scale(1.1) rotate(-2deg);
    }

    50%,
    70% {
      transform: scale(1.1) rotate(2deg);
    }
  }

  @-webkit-keyframes heartAnimate {
    0%,
    100% {
      -webkit-transform: scale(1) rotate(0);
    }

    10%,
    30% {
      -webkit-transform: scale(0.9) rotate(2deg);
    }

    20%,
    40%,
    60%,
    80% {
      -webkit-transform: scale(1.1) rotate(-2deg);
    }

    50%,
    70% {
      -webkit-transform: scale(1.1) rotate(2deg);
    }
  }

  @-moz-keyframes heartAnimate {
    0%,
    100% {
      -moz-transform: scale(1) rotate(0);
    }

    10%,
    30% {
      -moz-transform: scale(0.9) rotate(2deg);
    }

    20%,
    40%,
    60%,
    80% {
      -moz-transform: scale(1.1) rotate(-2deg);
    }

    50%,
    70% {
      -moz-transform: scale(1.1) rotate(2deg);
    }
  }

  @-o-keyframes heartAnimate {
    0%,
    100% {
      -o-transform: scale(1) rotate(0);
    }

    10%,
    30% {
      -o-transform: scale(0.9) rotate(2deg);
    }

    20%,
    40%,
    60%,
    80% {
      -o-transform: scale(1.1) rotate(-2deg);
    }

    50%,
    70% {
      -o-transform: scale(1.1) rotate(2deg);
    }
  }

  @-ms-keyframes heartAnimate {
    0%,
    100% {
      -ms-transform: scale(1) rotate(0);
    }

    10%,
    30% {
      -ms-transform: scale(0.9) rotate(2deg);
    }

    20%,
    40%,
    60%,
    80% {
      -ms-transform: scale(1.1) rotate(-2deg);
    }

    50%,
    70% {
      -ms-transform: scale(1.1) rotate(2deg);
    }
  }

  .btn-twinkle {
    position: absolute;
    bottom: 0px;
    right: calc(50% - 20px);
    height: 50px;
    margin-right: 5px;
    -webkit-animation: heartAnimate 3s ease infinite;
    -moz-animation: heartAnimate 3s ease infinite;
    -o-animation: heartAnimate 3s ease infinite;
    -ms-animation: heartAnimate 3s ease infinite;
    animation: heartAnimate 3s ease infinite;
  }

  .btn-twinkle:hover {
    cursor: pointer;
  }
}
</style>