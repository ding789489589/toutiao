<template>
  <van-icon
    color="#FD2D61"
    :name="attitude == -1 ? 'good-job-o' : 'good-job'"
    :class="{ active: attitude == 1 }"
    @click="onLike"
  />
</template>

<script>
import { delLike, addLike } from "@/api/article";
export default {
  name: "good",
  model: {
    prop: "attitude",
    event: "changeGood",
  },
  props: {
    //收藏状态
    attitude: {
      type: Number,
      require: true,
    },
    articleId: {
      type: [Number, String, Object],
      require: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    async onLike() {
      // 两个作用：1、交互提示 2、防止网络慢用户连续不断的点击按钮请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: "操作中...",
        forbidClick: true, // 是否禁止背景点击
      });

      try {
        // 如果已经点赞，则取消点赞
        if (this.attitude === 1) {
          await delLike(this.articleId);
          this.$emit("changeGood", -1);
          this.$toast.success("取消点赞");
        } else {
          // 否则添加点赞
          console.log(this.articleId);
          await addLike(this.articleId);
          this.$emit("changeGood", 1);
          this.$toast.success("点赞成功");
        }
      } catch (err) {
        console.log(err);
        this.$toast.fail("操作失败");
      }
    },
  },
};
</script>

<style scoped lang='less'>
.active {
  color: rgb(253, 45, 97);
}
</style>