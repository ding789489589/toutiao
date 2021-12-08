<template>
  <div>
    <van-cell class="comment-item">
      <van-image
        slot="icon"
        round
        width="30"
        height="30"
        style="margin-right: 10px"
        :src="commentList.aut_photo"
      />
      <span style="color: #466b9d" slot="title">
        <div class="user-name">{{ commentList.aut_name }}</div>
      </span>
      <template #right-icon>
        <div>
          <van-button
            class="like-btn"
            :icon="commentList.is_liking ? 'good-job' : 'good-job-o'"
            @click="onCommonLike"
            :loading="isLoading"
          ></van-button>
          <van-icon
            color="red"
            :name="commentList.is_liking ? 'like' : 'like-o'"
          />
        </div>
      </template>

      <div slot="label">
        <p style="color: #363636">{{ commentList.content }}</p>
        <p>
          <span style="margin-right: 10px">{{
            commentList.pubdate | relativeTime
          }}</span>
          <van-button
            size="mini"
            type="default"
            @click="$emit('showReply', commentList)"
            >回复{{ commentList.reply_count }}</van-button
          >
        </p>
      </div>
    </van-cell>
  </div>
</template>

<script>
import { deleteCommentLike, addCommentLike } from "@/api/comment";
export default {
  props: {
    commentList: {
      type: Object,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    async onCommonLike() {
      this.isLoading = true;
      try {
        if (this.commentList.like_count) {
          //已点赞  取消点赞
          await deleteCommentLike(this.commentList.com_id);
        } else {
          //未点赞 添加点赞
          await addCommentLike(this.commentList.com_id);
        }
      } catch (err) {
        console.log(err);
        this.$toast("点赞失败");
      }
      // 更新视图状态
      this.commentList.is_liking = !this.commentList.is_liking;
      this.isLoading = false;

      //给他爷爷组件发送一下总数数据  这里利用一下子孙传值

      this.$toast("操作成功");
    },
  },
};
</script>

<style scoped lang='less'>
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 26px;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-align: justify;
  }
  .comment-pubdate {
    font-size: 19px;
    color: #222;
    margin-right: 25px;
  }
  .bottom-badge {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
  }
  .like-btn {
    height: 30px;
    padding: 0;
    border: none;
    font-size: 19px;
    line-height: 30px;
    margin-right: 7px;
    .van-icon {
      font-size: 30px;
    }
  }
}
</style>