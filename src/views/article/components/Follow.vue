<template>
  <!-- 这里可以放两个btn的原因是他们由v-if标签，同时只能够显示一个 -->
  <van-button
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    v-if="isFollow"
    :loading="followLoading"
    @click="onFollow"
    >关注</van-button
  >
  <van-button
    class="follow-btn"
    round
    size="small"
    v-else
    :loading="followLoading"
    @click="onFollow"
    >已关注</van-button
  >
</template>

<script>
import { delFollow, addFollow } from "@/api/article";
export default {
  model: {
    prop: "isFollow",
    event: "changeFollow",
  },
  props: {
    articleAut_id: {
      type: [Number, String, Object],
      required: true,
    },
    isFollow: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      followLoading: false, //关注按钮中的加载状态显示，这个目的是防止用户连续多次的点击。起一个节流或防抖的效果
    };
  },
  methods: {
    //判断是否关注
    async onFollow() {
      this.followLoading = true;
      //这里的id是文章的aut_id 不是作者id
      const articleId = this.articleAut_id;

      console.log(articleId);
      try {
        if (this.isFollow) {
          //已关注 取消关注
          await delFollow(articleId);
        } else {
          //未关注，添加关注
          console.log("312312312");
          await addFollow(articleId);
        }
        // 方法一：
        // 目的是告诉父组件去改变this.isFollow 状态，从而促使数据更新，然后新的值再传回子组件，实现切换关注状态
        // this.$emit("FollowChange", !this.isFollow);

        // 方法二：
        // v-model方法
        // 原理：v-model的原理实际就是监测input事件，<input v-bind:value="sth" v-on:input="sth = $event.target.value" />
        // this.$emit("input", !this.isFollow);

        // 方法三：
        // 还可以给v-model自定义一下事件的属性名和事件名，效果其实和方法二一致
        console.log(this.isFollow);
        this.$emit("changeFollow", !this.isFollow);
      } catch (err) {
        console.log(err);
        this.$toast("关注失败，请重试");
      }
      this.followLoading = false;
    },
  },
};
</script>

<style>
</style>