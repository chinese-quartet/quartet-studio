<template>
  <a-row class="notice" style="background-color: #d6d6d6">
    <a-icon type="close-circle" @click="close" />
    <a-icon type="eye-invisible" @click="disable" />
    <p>
      <slot>{{ defaultMessage }}</slot>
    </p>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      defaultMessage: 'Please add notice message'
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    disable() {
      this.$emit('disable')
    }
  }
}
</script>

<style lang="less">
.notice {
  border-radius: 3px;

  .anticon {
    svg {
      width: 16px !important;
      height: 16px !important;
    }
  }

  .anticon-close-circle, .anticon-eye-invisible {
    float: right;
    margin: 5px;
  }

  .anticon-close-circle:hover {
    cursor: pointer;
  }

  p {
    width: 100%;
    height: 100%;
    padding: 10px;
    margin: 0px;
  }
}
</style>
