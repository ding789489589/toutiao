<template>
  <div class="channel-edit">
    <!-- 我的频道标题 -->
    <van-cell title="我的频道" center :border="false">
      <van-button
        size="mini"
        round
        type="danger"
        @click="isCloseBtnShow = !isCloseBtnShow"
        >{{ isCloseBtnShow ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <!-- 我的频道内容 -->
    <van-grid :gutter="10" :column-num="3">
      <van-grid-item
        v-for="(value, index) in channels"
        :key="index"
        class="channel-item"
        :class="{ addMargin: index <= 3 }"
        @click="active(index)"
      >
        <div
          slot="icon"
          v-show="
            isCloseBtnShow && !notdelChannel.some((item) => value.id == item)
          "
          @click.prevent="delChannelsFromMy(value.id)"
        >
          <van-icon name="close" class="closeBtn" />
        </div>
        <div slot="text" class="text" :class="{ active: activeNum === index }">
          {{ value.name }}
        </div>
      </van-grid-item>
    </van-grid>

    <!-- 
      推荐标题 
    -->
    <van-cell title="推荐频道" center :border="false"></van-cell>
    <!-- 
      推荐内容
     -->
    <van-grid :gutter="10" class="recommend-grid" :column-num="3">
      <van-grid-item
        v-for="(value, index) in recommendChannels"
        :key="index"
        :text="value.name"
        class="channel-item"
        icon="plus"
        :class="{ addMargin: index <= 3 }"
        @click="addChannelsInMy(value)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel } from "@/api/home";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";
export default {
  props: {
    channels: {
      type: Array,
      required: true,
    },
    activeNum: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isCloseBtnShow: false, // 是否为编辑模式
      allChannels: [], //所有推荐频道
      notdelChannel: [0, 3],
    };
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    //加载所有频道列表项
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();

        this.allChannels = data.data.channels;
        console.log(this.recommendChannels);
      } catch (err) {
        console.log("获取所有列表失败", err);
      }
    },
    //添加当前项目到“我的频道”里
    async addChannelsInMy(val) {
      this.channels.push(val);
      if (this.user) {
        //发送到服务器
        try {
          // 已登录，数据存储到线上
          await addUserChannel({
            id: val.id, // 频道 id
            seq: this.channels.length, // 频道的 序号
          });
          console.log(this.channels);
          this.$toast("添加成功");
        } catch (err) {
          this.$toast("保存失败");
          console.log(err);
        }
      } else {
        //存储到本地
        setItem("MyChannels", this.channels);
        this.$toast("保存成功");
      }
    },

    //删除当前项目
    delChannelsFromMy(id) {
      const index = this.channels.findIndex((item) => {
        return item.id == id;
      });
      this.channels.splice(index, 1);
    },
    // 影响主页的active
    active(index) {
      this.$emit("editActive", index);
    },
  },
  computed: {
    //映射user
    ...mapState(["user"]),
    //计算出不包含“我的频道”内的项目
    recommendChannels() {
      return this.allChannels.filter((allItem) => {
        return !this.channels.find((myChannel) => {
          return allItem.id == myChannel.id;
        });
      });
    },
  },
};
</script>

<style scoped lang='less'>
.channel-edit {
  margin-top: 80px;
  .van-cell__value {
    display: flex;
    justify-content: right;
  }
  // 我的频道页
  .channel-item {
    height: 86px;
    min-width: 0; //解决white-space: nowrap;撑大盒子问题
    /deep/ .van-grid-item__content {
      background-color: #f5f5f6;
      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 25px;
        white-space: nowrap;
        min-width: 0;
      }
    }
    .closeBtn {
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 32px;
      z-index: 10;
    }
    /deep/ .van-grid-item__icon-wrapper {
      position: unset;
    }
    //高亮显示
    .active {
      color: red !important;
    }
  }

  //推荐频道页
  /deep/ .recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      color: #222;
      font-size: 20px;
      .van-icon {
        font-size: 24px;
      }
    }
    .van-grid-item__text {
      margin-top: 0;
    }
  }
  .addMargin {
    margin-top: 20px;
  }
}
</style>