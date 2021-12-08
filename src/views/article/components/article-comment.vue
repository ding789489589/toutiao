<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <!-- 评论列表的每一项 -->
      <CommentItem
        v-for="(item, index) in commentList"
        :key="index"
        :commentList="item"
        v-on="$listeners"
      />
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <!-- <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="badge">发布</van-button>
      </van-field>
    </van-cell-group> -->
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { getComments } from "@/api/comment";
import CommentItem from "./comment-item";
export default {
  name: "ArticleComment",
  components: {
    CommentItem,
  },
  props: {
    showReply: {
      type: Boolean,
    },
    //文章id
    articleId: {
      type: [Number, String, Object],
    },
    //列表项
    commentList: {
      type: Array,
      default: () => [],
    },
    //判断是请求文章De 评论 还是 请求 回复de评论
    type: {
      type: String,
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ["a", "c"].indexOf(value) !== -1;
      },
      default: "a",
    },
    ReplyId: {
      type: [Number, Object],
    },
  },
  data() {
    return {
      // commentList: [], // 评论列表   由父组件index控制
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 请求下一页数据的页码
      totalCount: 0, // 总数据条数
    };
  },
  created() {
    this.onLoad();
  },
  methods: {
    async onLoad() {
      console.log("我是onLoad");
      console.log(this.ReplyId);
      //1. 请求数据
      const { data } = await getComments({
        type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source:
          this.type == "c"
            ? this.ReplyId.toString()
            : this.articleId.toString(), // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: 15, // 每页大小
      });
      //2. 存储数据
      this.totalCount = data.data.total_count;
      //3. 传递评论总数
      this.$emit("totalCount", this.totalCount);

      const { results } = data.data;
      this.commentList.push(...results);

      //4. 关闭loading状态
      this.loading = false;
      //5. 判断请求是否结束
      if (results.length) {
        this.offset = data.data.last_id; // 更新获取下一页数据的页码
      } else {
        this.finished = true;
      }
    },
  },
};
</script>

<style scoped lang="less">
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>