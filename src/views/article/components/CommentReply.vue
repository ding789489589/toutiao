<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${comment.reply_count}条回复`">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论项 -->
    <CommentItem :commentList="comment" />
    <!-- /当前评论项 -->

    <van-cell title="所有回复" />
    <!-- 评论的回复列表 -->
    <ArticleComment
      type="c"
      :ReplyId="comment.com_id"
      :commentList="commentList"
    />
    <!-- /评论的回复列表 -->

    <!-- 底部 -->
    <div class="write-wrap">
      <div class="write-content" @click="isReplyCommentShow = true">写回复</div>
    </div>
    <!-- /底部 -->

    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyCommentShow"
      get-container="body"
      round
      position="bottom"
    >
      <!-- 回复列表 -->
      <CommentPost
        type="c"
        :ReplyId="comment.com_id"
        :target="target"
        @post-success="onPostSuccess"
      />
      <!-- /回复列表 -->
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import CommentItem from "./comment-item.vue";
import ArticleComment from "./article-comment.vue";
import CommentPost from "./CommentPost.vue";
export default {
  name: "CommentReply",
  components: {
    CommentItem,
    ArticleComment,
    CommentPost,
  },
  props: {
    //评论对象
    comment: {
      type: Object,
      require: true,
    },
    target: {
      type: [Number, Object],
    },
  },
  data() {
    return {
      isReplyCommentShow: false, //评论回复是否显示
      commentList: [], //评论回复列表
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //发布成功事件
    onPostSuccess(data) {
      // 关闭弹出层

      // 将发布内容显示到列表顶部
      console.log(data);
      this.commentList.unshift(data.new_obj);
      console.log(this.commentList, "---------------");
      this.isReplyCommentShow = false;
    },
  },
};
</script>

<style scoped lang='less'>
.comment-reply {
  .write-wrap {
    height: 88px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-top: 1px solid #eee;
    .write-content {
      width: 60%;
      line-height: 44px;
      text-align: center;
      border-radius: 44px;
      font-size: 28px;
      color: #a7a7a7;
      border: 1px solid #eee;
    }
  }
  /deep/.article-comments {
    position: fixed;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 45%;

    bottom: 88px;
    width: 100%;
  }
}
</style>