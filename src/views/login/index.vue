<template>
  <div class="login-container">
    <!-- 标题组件 -->
    <van-nav-bar class="page-nav-bar" title="登录" />

    <!-- 表单组件 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="输入手机号"
        :rules="userRules.mobile"
      >
        <!-- 插槽写法：
          1. 使用template  v-solt：xxxx    （简写方式 #xxx）
          2. 当插槽内只有一个标签时，可以直接在标签内添加  slot=“xxx”  （这是老语法，可以写在标签内，也可以写再templat内）
        这里的字体图标使用具名插槽来自定义 -->
        <template v-slot:left-icon>
          <i class="iconfont icon-shouji"></i>
        </template>
      </van-field>
      <van-field
        v-model="user.code"
        type="text"
        name="code"
        placeholder="输入验证码"
        :rules="userRules.code"
      >
        <i slot="left-icon" class="iconfont icon-yanzhengma1"></i>
        <template #button>
          <!-- 
            倒计时组件
          -->

          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            size="small"
            round
            class="send-sms-btn"
            native-type="button"
            @click="onSendSmsCode"
            >发送验证码
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button
          round
          block
          type="info"
          native-type="submit"
          color="linear-gradient(to right, #ff6034, #ee0a24)"
          >提交</van-button
        >
      </div>
    </van-form>

    <!-- 登录提示框 -->
    <van-notify v-model="show" :type="tipType">
      <van-icon name="success" v-show="tipSuccess" />
        <span v-show="tipSuccess" >登陆成功</span>
        <van-loading size="24px" v-show="!tipSuccess">加载中...</van-loading>
    </van-notify>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user.js";
export default {
  data() {
    return {
      user: {
        mobile: "13522456677",
        code: "246810",
      },
      //验证规则
      userRules: {
        mobile: [
          {
            required: true,
            message: "请填写用户名",
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: "手机号格式错误",
          },
        ],
        code: [
          {
            required: true,
            message: "请填写验证码",
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误",
          },
        ],
      },
      isCountDownShow: false,
      show: false, //提示框展示
      tipSuccess: false, //框内消息展示
      tipType: "primary",
    };
  },
  methods: {
    async onSubmit() {
      this.show = true;
      // 主要通知
      // this.$notify({ type: 'primary', message: '登陆中...' ,duration:0});
      try {
        const res = await login(this.user);
        this.$store.commit('setUser',res.data.data)


        this.tipSuccess = true;
        this.tipType = "success";
        setTimeout(() => {
          this.show = false;
          this.tipSuccess = false;
          this.tipType = "primary";
          this.$router.push('/my')
        }, 2000);

        
        // this.$notify({ type: 'success', message: '登陆成功' ,duration:3000});
      } catch (err) {
        this.show = false;
        this.tipSuccess = false;
        this.tipType = "primary";
        console.log(err);
        if (err.response.status === 400) {
          
          this.$notify({
            type: "danger",
            message: "手机号或验证码错误",
            duration: 3000,
          });
        } else {
          this.$notify({
            type: "danger",
            message: "登陆错误，请稍后重试",
            duration: 3000,
          });
        }
      }
    },
    async onSendSmsCode() {
      // 1. 校验手机号
      try {
        //通过refs，获取表单实例，然后调用validate来验证biao单中name为mobile的规则是否通过
        await this.$refs.loginForm.validate("mobile");
      } catch (err) {
        return console.log("验证失败", err);
      }
      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true;

      //3. 发送验证码
      try {
        await sendSms(this.user.mobile)
      
      } catch (error) {
        //429错误是应为验证码需要隔一分钟才能在发送，次数过多
       if( err.response.status === 429){
         this.$toast.fail('发送次数过多，请稍后重试');
       }else{
         this.$toast.fail('获取验证码失败，请过会重试');
       }
      }
      
    },
  },
};
</script>

<style scope lang='less'>
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
  }
}
.van-notify{
  height: 98px;
}
</style>