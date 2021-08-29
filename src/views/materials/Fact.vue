<template>
  <a-row :gutter="24">
    <a-col v-for="item in factData" :xs="24" :md="12" :lg="6" :key="item.name">
      <div @click="selectItem(item.key)" class="fact-item">
        <img
          width="100%"
          height="200"
          src="http://www.rainsurebio.com/qfy-content/uploads/2020/03/dca143037912404bfc097f509af837c4-e1584692168980-1024x429.jpg"
        />
        <h4 class="fact-item-title">{{ item.name }}</h4>
        <div class="fact-info">
          <a-button type="primary" @click="requestMaterials">Request</a-button>
          <a-row class="fact-num" :class="'fact-num__' + item.name.toLowerCase()">
            <a-col :span="16" class="label">
              Requested Materials
            </a-col>
            <a-col :span="8" class="data">
              <a-tag>{{ item.requestTubes }} Tubes</a-tag>
            </a-col>
          </a-row>
          <a-row class="fact-num" :class="'fact-num__' + item.name.toLowerCase()">
            <a-col :span="16" class="label">
              Generated Data
            </a-col>
            <a-col :span="8" class="data">
              <a-tag>{{ item.generatedData }} Tubes</a-tag>
            </a-col>
          </a-row>
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
    requestMaterials() {
      this.$router.push({
        name: 'request-materials'
      })
    },
  },
  created() {}
}
</script>

<style lang="less" scoped>
.fact-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid #d6d6d6;

  img {
    border-radius: 5px;
  }

  .fact-link:hover,
  .fact-link:active,
  .fact-link:-webkit-any-link {
    text-decoration: none;
  }

  .fact-item-title {
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

    .fact-num {
      margin-top: 5px;
      width: 90%;
      display: flex;
      justify-content: center;
      align-items: center;

      .label {
        display: flex;
        justify-content: left;
        font-size: 1rem;
        font-weight: 300;
      }

      .data {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
