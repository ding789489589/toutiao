<template>
  <div>
    <!-- 搜索结果  start -->
    <SearchResult v-if="isResultShow" :q="searchText" ref="searchResult" />
    <!-- end -->

    <!-- 搜索联想  start-->
    <!-- v-on="$listeners"   用于孙子给爷爷传值 -->
    <SearchSuggestion
      v-else-if="searchText"
      :search_suggestions="search_suggestions"
      :searchText="searchText"
      @search="search"
    />
    <!-- end-->

    <!-- 搜索历史  start -->
    <SearchHistory v-else :historySearchList="historySearchList" />
    <!-- end -->
  </div>
</template>

<script>
import SearchHistory from "./searchCompoents/search-history";
import SearchSuggestion from "./searchCompoents/search-suggestion";
import SearchResult from "./searchCompoents/search-result";
import { debounce } from "lodash";

import { getSearchSuggestion } from "@/api/search";
export default {
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult,
  },
  props: {
    //搜索框内容
    searchText: {
      type: String,
    },
  },
  data() {
    return {
      search_suggestions: [], //联想搜索列表
      isResultShow: false, //是否展示搜索结果
      historySearchList:
        JSON.parse(localStorage.getItem("historySearch")) || [],
    };
  },
  watch: {
    searchText: {
      // debounce 函数
      // 参数1：函数
      // 参数2：防抖时间
      // 返回值：防抖之后的函数，和参数1功能是一样的
      handler: debounce(function (newVal) {
        newVal == ""
          ? (this.isResultShow = false)
          : this.loadSearchResult(newVal);
      }, 1000),
    },
  },
  methods: {
    //加载联想建议结果
    async loadSearchResult(newVal) {
      try {
        const { data } = await getSearchSuggestion(newVal);
        this.search_suggestions = data.data.options;
        console.log(data);
        console.log(this.searchText);
      } catch (err) {
        console.log(err);
        this.$toast("获取联想建议失败！");
      }
    },
    /**
     *  -- 用于改变isResultSshow的状态，当儿子组件--联想建议点击时，触发该方法，然后将isResultShow更改为true后，
     *     search-result组件会自动触发一次onLoad事件，数据就会自动获取了
     * */
    search(val) {
      //触发父亲身上的方法  ChangeSearchText
      this.$emit("ChangeSearchText", val);
      this.onSave(val);
      this.isResultShow = true;
    },

    //存储历史记录
    onSave(val) {
      // 存储搜索历史记录
      // 要求：不要有重复历史记录、最新的排在最前面
      const index = this.historySearchList.indexOf(val);
      if (index !== -1) {
        this.historySearchList.splice(index, 1);
      }
      this.historySearchList.unshift(val);
      localStorage.setItem(
        "historySearch",
        JSON.stringify(this.historySearchList)
      );
    },

    //用于实现enter后搜索
    enterSearch() {
      this.onSave(this.searchText);
      this.isResultShow = true;
    },
  },
};
</script>

<style>
</style>