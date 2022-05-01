<template>
  <a-row :gutter="24">
    <a-col v-for="item in factData" :xs="24" :md="12" :lg="6" :key="item.name">
      <div @click="selectItem(item.key)" class="fact-item">
        <!-- <h4 class="fact-item-title">{{ item.name }}</h4> -->
        <img width="100%" height="100%" :src="require(`@/assets/images/${item.key}-materials-pack.png`)" />
        <a-button
          size="small"
          class="request-btn"
          :class="'request-btn-' + item.key"
          @click.stop="requestMaterials(item.name)"
        >
          Request {{ item.name }} Materials
        </a-button>
        <a style="margin: 5px 0px;" @click.stop="downloadItem(item.key)"> &gt;&gt;&gt; Download the Specification &lt;&lt;&lt; </a>
        <div class="fact-info">
          <img
            width="100%"
            height="100%"
            style="border-bottom: 1px solid #d6d6d6; border-top: 1px solid #d6d6d6;"
            :src="require(`@/assets/images/${item.key}-materials.png`)"
          />
          <p v-html="item.specification" style="margin-bottom: 0px"></p>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'Fact',
  components: {},
  props: {
    factData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    selectItem(itemKey) {
      this.$emit('select-item', itemKey)
    },
    downloadItem(itemKey) {
      this.$emit('download-item', itemKey)
    },
    requestMaterials(materialsType) {
      this.$router.push({
        name: 'request-materials',
        query: {
          materialsType: materialsType
        }
      })
    }
  },
  created() {}
}
</script>

<style lang="less" scoped>
.fact-item {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #d6d6d6;

  .request-btn {
    height: unset;
    margin-top: 5px;
    font-size: 1rem;
    color: #ffffff;
    // background-color: #ffffff;
    // border-color: #1890ff;
  }

  .request-btn-dna {
    // background-color: #34ccff;
    background-color: #c3a5b1;
  }

  .request-btn-rna {
    // background-color: #00cc66;
    background-color: #cec5b8;
  }

  .request-btn-protein {
    // background-color: #ffc000;
    background-color: #babbbf;
  }

  .request-btn-metabolite {
    // background-color: #fe5150;
    background-color: #b9bfb5;
  }

  .request-btn:hover {
    color: #ffffff;
    background-color: #1890ff;
    border-color: #1890ff;
  }

  img {
    border-radius: 5px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  .fact-link:hover,
  .fact-link:active,
  .fact-link:-webkit-any-link {
    text-decoration: none;
  }

  .fact-item-title {
    position: absolute;
    top: 5px;
    left: 25px;
    font-family: Helvetica, sans-serif;
    color: #000000;
    font-size: 18px;
    margin: 5px 0px 5px;
  }

  .fact-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 5px 15px;
    border-radius: 6px;
    width: 100%;
    cursor: pointer;
    margin-bottom: 10px;

    .ant-btn {
      margin-bottom: 10px;
    }
  }
}
</style>

<style lang="less">
.fact-item {
  .fact-info {
    padding: 0px !important;
    margin: 0px !important;
  }

  p {
    text-align: justify;
    border: unset;
    height: 110px;
    overflow: scroll;
    padding: 10px;
  }
}
</style>