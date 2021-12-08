<template>
  <van-icon
    color="#ffa500"
    :name="isCollected ? 'star' : 'star-o'"
    :class="{ active: isCollected }"
    @click="onShouCang"
    :loading="isLoading"
  />
</template>

<script>
import { deleteCollect, addCollect } from "@/api/article";
export default {
  name: "shoucang",
  model: {
    prop: "isCollected",
    event: "changeShouCang",
  },
  props: {
    //收藏状态
    isCollected: {
      type: Boolean,
      require: true,
    },
    articleArt_id: {
      type: [Number, String, Object],
      require: true,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    async onShouCang() {
      this.isLoading = true;
      try {
        if (this.isCollected) {
          //已收藏 则取消收藏

          await deleteCollect(this.articleArt_id);
        } else {
          //  若没有收藏  侧收藏
          await addCollect(this.articleArt_id);
        }
        this.$emit("changeShouCang", !this.isCollected);
      } catch (err) {
        console.log(err);
        this.$toast("收藏失败，请稍后重试");
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped lang='less'>
.active {
  color: gold;
}
</style>