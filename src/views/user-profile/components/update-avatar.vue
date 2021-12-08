<template>
  <div class="avatar-content">
    <img :src="imgUrl" ref="img" />
    <div class="toolbar">
      <span @click="$emit('close')">取消</span>
      <span @click="confirm">完成</span>
    </div>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { updateUserAvatar } from "@/api/user";
export default {
  props: {
    imgUrl: {
      type: [String, Object],
      require: true,
      cropper: null,
    },
  },
  mounted() {
    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: "move", // 画布和图片都可以移动
      aspectRatio: 1, // 裁剪区默认正方形
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false, // 关闭默认背景
    });
  },
  methods: {
    confirm() {
      this.cropper.getCroppedCanvas().toBlob(async (blob) => {
        this.updateAvatar(blob);
      });
    },
    async updateAvatar(blob) {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true,
        loadingType: "spinner",
        duration: 0,
      });
      try {
        const formData = new FormData();
        formData.append("photo", blob);
        const { data } = await updateUserAvatar(formData);
        // 关闭弹层，更新视图
        this.$emit("close");
        this.$emit("update-avatar", data.data.photo);
        this.$toast("更新成功");
      } catch (err) {
        this.$toast("更新失败");
      }
    },
  },
};
</script>

<style scoped lang='less'>
.avatar-content {
  background: #000;
  height: 100%;
  img {
    display: block;
    max-width: 100%;
  }
  .toolbar {
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      flex: 1;
      width: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 28px;
      box-sizing: border-box;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>