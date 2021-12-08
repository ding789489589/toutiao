<template>
  <div class="search-suggestion">
    <!-- 这里直接由孙子组件给爷爷组件传值，需要在父亲上绑定事件，用$linster接受爷爷传给父亲的事件 -->
    <van-cell
      icon="search"
      v-for="(item, index) in search_suggestions"
      :key="index"
      @click="$emit('search', item)"
    >
      <div slot="title" v-html="highLight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "SearchSuggestion",
  components: {},
  props: {
    //联想建议结果列表
    search_suggestions: {
      type: Array,
      require: true,
    },
    //搜索框内容
    searchText: {
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    highLight(str) {
      const highlightStr = `<span class="active">${this.searchText}</span>`;
      const reg = new RegExp(this.searchText, "gi");
      // text.replace(/匹配的内容/gi, highlightStr)

      return str.replace(reg, highlightStr);
    },
  },
};
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ .active {
    color: rgb(31, 114, 246);
  }
}
</style>