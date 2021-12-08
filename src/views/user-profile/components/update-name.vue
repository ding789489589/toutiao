<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="编辑昵称"
      left-text="取消"
      right-text="确定"
      @click-left="$emit('close')"
      @click-right="onEdit"
    />
    <!-- /导航栏 -->
    <!-- 输入框 -->
    <div class="edit-field">
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="20"
        placeholder="请输入昵称"
        show-word-limit
      />
      <!-- /输入框 -->
    </div>
  </div>
</template>

<script>
import { updateUserName } from "@/api/user";
export default {
  name: "UpdateName",
  props: {
    value: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      message: this.value,
    };
  },
  methods: {
    async onEdit() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        if (this.message.trim() === "") return this.$toast("请输入昵称");
        await updateUserName({
          name: this.message,
        });
        this.$emit("input", this.message);
        this.$emit("close");
        this.$toast("更新成功");
      } catch (err) {
        if (err.response.status == 409) {
          return this.$toast("昵称重复了 ");
        }
        this.$toast("更新失败");
      }
    },
  },
};
</script>

<style scoped lang='less'>
.update-name {
  .edit-field {
    display: flex;
    align-items: center;
    padding: 32px 0 32px 32px;

    .post-field {
      background-color: #0e86ff;
    }
  }
}
</style>