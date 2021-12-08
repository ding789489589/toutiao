<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearch } from "@/api/search";
export default {
  name: "SearchResult",
  components: {},
  props: {
    q: {
      type: String,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad(searchText) {
      this.finished = false;
      //获取搜索结果
      try {
        const { data } = await getSearch({
          page: this.page, // 页码
          per_page: this.perPage, // 每页大小
          q: this.q || searchText, // 搜索关键字
        });
        //将结果添加到list
        const { results } = data.data;
        this.list.push(...results);

        // 加载状态结束
        this.loading = false;

        // 4. 判断数据是否加载完毕
        if (results.length) {
          this.page++; // 更新获取下一页数据的页码
        } else {
          this.finished = true; // 没有数据了，将加载状态设置结束，不再 onLoad
        }
      } catch (err) {
        this.error = true;
        console.log(err);
        this.$toast("获取搜索结果失败");
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
