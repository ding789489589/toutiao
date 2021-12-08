<template>
  <div class="my-container">
    <!-- //用户信息页面 -->
    <div class="userInfo">
      <div class="base" v-if="user">
        <div class="left">
          <van-image
            class="left-avater"
            fit="cover"
            round
            :src="userInfo.photo"
          />
          <span>{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button type="default" size="mini" round to="/user/profile"
            >编辑资料</van-button
          >
        </div>
        <!-- //注册 -->
      </div>
      <div class="header" @click="$router.push('/login')" v-else>
        <img src="@/assets/mobile.png" class="mobile-img" />
        <span>登录/注册</span>
      </div>
      <!-- //，发布，粉丝，关注，获赞 -->
      <div class="infoMsg" v-if="user">
        <div class="infoMsg-item">
          <span class="num">{{ userInfo.art_count }}</span>
          <span class="msg">发布</span>
        </div>
        <div class="infoMsg-item">
          <span class="num">{{ userInfo.fans_count }}</span>
          <span class="msg">粉丝</span>
        </div>
        <div class="infoMsg-item">
          <span class="num">{{ userInfo.follow_count }}</span>
          <span class="msg">关注</span>
        </div>
        <div class="infoMsg-item">
          <span class="num">{{ userInfo.like_count }}</span>
          <span class="msg">获赞</span>
        </div>
      </div>
      <div class="model">
        <van-grid :column-num="2">
          <van-grid-item text="收藏">
            <i slot="icon" class="iconfont icon-shoucang"></i>
          </van-grid-item>

          <van-grid-item text="历史" :clickable="true">
            <i slot="icon" :clickable="true" class="iconfont icon-lishi1"></i>
          </van-grid-item>
        </van-grid>
      </div>
      <van-cell title="消息通知" is-link />
      <van-cell title="我的朋友" is-link />
      <van-cell
        class="logout-cell"
        @click="onLogout"
        v-if="user"
        title="退出登录"
        center
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserInfo } from "@/api/user.js";
export default {
  data() {
    return {
      userInfo: {},
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    /**
     * 退出登录
     * */
    onLogout() {
      // 退出提示
      // 在组件中需要使用 this.$dialog 来调用弹框组件
      this.$dialog
        .confirm({
          title: "确认退出吗？",
        })
        .then(() => {
          // on confirm
          // 确认退出：清除登录状态（容器中的 user + 本地存储中的 user）
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
          console.log("取消执行这里");
        });
    },
    /**
     * 获取用户基本信息
     */
    async loadUser() {
      try {
        const { data } = await getUserInfo();
        this.userInfo = data.data;
        console.log(data);
      } catch (err) {
        this.$toast.fail("获取用户基本信息失败", err);
      }
    },
  },
  async created() {
    console.log(this.user);
    if (this.user && this.user.token) {
      console.log("123123");
      this.loadUser();
    }
  },
};
</script>

<style scope lang="less">
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png") no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .mobile-img {
      width: 132px;
      height: 132px;
    }
    span {
      font-size: 32px;
    }
  }
  .userInfo {
    height: 361px;
    background: url("~@/assets/banner.png") no-repeat;
    background-size: cover;
    .base {
      width: 100%;
      height: 231px;
      padding: 76px 32px 23px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      .left {
        display: flex;
        align-items: center;
        span {
          font-size: 32px;
          padding-left: 20px;
        }
        .left-avater {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
        }
      }
      .right {
        display: flex;
      }
    }
    .infoMsg {
      display: flex;
      .infoMsg-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        height: 130px;
        color: #fff;
        .num {
          font-size: 36px;
          margin-bottom: 15px;
        }
        .msg {
          font-size: 26px;
        }
      }
    }
    .model {
      .icon-shoucang {
        font-size: 45px;
        color: #eb5253;
      }
      .icon-lishi1 {
        font-size: 45px;
        color: #ff9d1d;
      }
    }
    .logout-cell {
      height: 100px;
      text-align: center;
      color: #eb5253;
      margin: 10px 0;
      font-size: 30px;
    }
  }
}
</style>