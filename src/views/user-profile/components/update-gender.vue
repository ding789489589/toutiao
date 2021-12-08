<template>
  <div class="update-gender">
    <van-picker
      title="编辑性别"
      show-toolbar
      :columns="columns"
      :default-index="value"
      @confirm="onConfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
import { updateUserName } from "@/api/user";
export default {
  name: "UpdateName",
  props: {
    value: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
    };
  },
  methods: {
    async onConfirm(v, index) {
      console.log(index);
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        await updateUserName({
          gender: index,
        });

        this.$emit("input", index);
        this.$emit("close");
        this.$toast("更新成功");
      } catch (err) {
        this.$toast("更新失败");
      }
    },
  },
};
</script>

<style scoped lang='less'>
</style>