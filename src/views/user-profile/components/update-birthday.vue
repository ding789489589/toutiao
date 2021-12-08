<template>
  <van-datetime-picker
    v-model="currentDate"
    type="date"
    title="选择年月日"
    :min-date="minDate"
    :max-date="maxDate"
    @cancel="$emit('close')"
    @confirm="onConfirm"
  />
</template>

<script>
import dayJs from "dayjs";
import { updateUserName } from "@/api/user.js";
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1970, 1, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    };
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        await updateUserName({
          birthday: dayJs(this.currentDate).format("YYYY-MM-DD"),
        });
        console.log(dayJs(this.currentDate).format("YYYY-MM-DD"));
        this.$emit("input", dayJs(this.currentDate).format("YYYY-MM-DD"));
        this.$emit("close");
        this.$toast("更新成功");
      } catch (err) {
        this.$toast("更新失败");
      }
    },
  },
};
</script>

<style>
</style>