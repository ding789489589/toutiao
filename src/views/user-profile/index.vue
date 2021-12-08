<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 个人性息 -->
    <van-cell title="头像" is-link>
      <van-image
        class="avatar"
        fit="cover"
        round
        @click="EditAvatar"
        :src="user.photo"
      />
      <!-- 上传头像 -->
      <input
        type="file"
        @change="inputChange"
        ref="inputFile"
        style="display: none"
      />
      <!-- /上传头像 -->
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isShowUpdateName = true"
    />
    <van-cell
      title="性别"
      :value="user.gender ? '女' : '男'"
      is-link
      @click="isShowUpdateGender = true"
    />
    <van-cell
      title="生日"
      :value="user.birthdy || '1977-01-01'"
      is-link
      @click="isShowUpdateBirthday = true"
    />
    <!-- /个人性息 -->

    <!-- 编辑头像弹层 -->
    <van-popup
      v-model="isShowUpdateAvatar"
      style="height: 100%"
      position="bottom"
    >
      <UpdateAvatar
        :imgUrl="imgUrl"
        @update-avatar="user.photo = $event"
        v-if="isShowUpdateAvatar"
        @close="isShowUpdateAvatar = false"
      />
    </van-popup>
    <!-- 编辑头像弹层 -->

    <!-- 编辑昵称弹层 -->
    <van-popup v-model="isShowUpdateName" style="height: 70%" position="bottom">
      <UpdateName
        v-model="user.name"
        v-if="isShowUpdateName"
        @close="isShowUpdateName = false"
      />
    </van-popup>
    <!-- 编辑昵称弹层 -->

    <!-- 编辑性别弹层 -->
    <van-popup
      v-model="isShowUpdateGender"
      style="height: 70%"
      position="bottom"
    >
      <UpdateGender
        v-model="user.gender"
        v-if="isShowUpdateGender"
        @close="isShowUpdateGender = false"
      />
    </van-popup>
    <!-- 编辑性别弹层 -->

    <!-- 编辑生日弹层 -->
    <van-popup
      v-model="isShowUpdateBirthday"
      style="height: 70%"
      position="bottom"
    >
      <UpdateBirthday
        v-model="user.birthdy"
        v-if="isShowUpdateBirthday"
        @close="isShowUpdateBirthday = false"
      />
    </van-popup>
    <!-- 编生日弹层 -->
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdateName from "./components/update-name.vue";
import UpdateGender from "./components/update-gender.vue";
import UpdateBirthday from "./components/update-birthday.vue";
import UpdateAvatar from "./components/update-avatar.vue";
export default {
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdateAvatar,
    imgUrl: null, //图片的url地址
  },
  data() {
    return {
      user: {},
      isShowUpdateAvatar: false, //头像弹层是否显示
      isShowUpdateName: false, //昵称弹层是否显示
      isShowUpdateGender: false, //性别弹层是否显示
      isShowUpdateBirthday: false, //生日弹层是否显示
      imgUrl: null,
    };
  },

  created() {
    this.loadProfile();
  },

  methods: {
    async loadProfile() {
      try {
        const { data } = await getUserProfile();

        this.user = data.data;
      } catch (err) {
        console.log(err);
        this.$toast("获取用户基本信息失败");
      }
    },
    EditAvatar() {
      this.$refs.inputFile.click();
    },
    //获取上传文件信息
    inputChange() {
      // 获取文件对象
      const file = this.$refs.inputFile.files[0];
      // 获取blob数据
      this.imgUrl = window.URL.createObjectURL(file);
      //清除原来的数据
      this.$refs.inputFile.value = "";
      this.isShowUpdateAvatar = true;
      console.log(this.imgUrl);
    },
  },
};
</script>

<style scoped lang='less'>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
}
</style>