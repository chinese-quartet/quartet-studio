<template>
  <a-row class="pdf-container">
    <a-row class="indicator">
      <a-button shape="circle" size="large">{{pageNum}}/{{pageTotalNum}}</a-button>
    </a-row>
    <a-row class="tools">
      <a-button type="primary" shape="circle">{{pageNum}}/{{pageTotalNum}}</a-button>
      <a-button type="primary" shape="circle" icon="up" @click="prevPage"></a-button>
      <a-button type="primary" shape="circle" icon="down" @click="nextPage"></a-button>
      <a-button type="primary" @click="pdfPrintAll" style="display: none;" shape="circle" icon="printer"></a-button>
      <a-button type="primary" @click="downloadFile(url)" shape="circle" icon="download"></a-button>
    </a-row>
    <a-row class="pdf-viewer" :style="{ height: height }">
      <pdf
        ref="pdf"
        :src="url"
        :page="pageNum"
        @progress="loadedRatio = $event"
        @page-loaded="pageLoaded($event)"
        @num-pages="pageTotalNum=$event"
        @error="pdfError($event)"
        @link-clicked="page = $event"
      ></pdf>
    </a-row>
  </a-row>
</template>
 
<script>
import pdf from 'vue-pdf'

export default {
  components: {
    pdf
  },
  props: {
    url: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: false,
      default: '500px'
    }
  },
  data() {
    return {
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      loadedRatio: 0,
      curPageNum: 0
    }
  },
  methods: {
    downloadFile(link) {
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute('href', link)
      downloadAnchorNode.setAttribute('target', '_blank')
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
    },
    prevPage() {
      var page = this.pageNum
      page = page > 1 ? page - 1 : this.pageTotalNum
      this.pageNum = page
    },
    nextPage() {
      var page = this.pageNum
      page = page < this.pageTotalNum ? page + 1 : 1
      this.pageNum = page
    },
    clock() {
      this.pageRotate += 90
    },
    counterClock() {
      this.pageRotate -= 90
    },
    pageLoaded(e) {
      this.curPageNum = e
    },
    pdfError(error) {
      console.error(error)
    },
    pdfPrintAll() {
      this.$refs.pdf.print()
    },
    pdfPrint() {
      this.$refs.pdf.print(100, [1, 2])
    }
  }
}
</script>

<style lang="less" scoped>
.pdf-container {
  .indicator {
    display: flex;
    justify-content: center;
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 100;
  }

  .tools {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 100;
    display: flex;
    flex-direction: column;

    .ant-btn {
      margin-bottom: 5px;
    }
  }
}
</style>

<style lang="less">
.pdf-viewer {
  overflow: scroll;

  .annotationLayer {
    display: none !important;
  }
}
</style>
