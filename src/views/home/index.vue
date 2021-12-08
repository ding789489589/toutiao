<template>
  <div class="home-container">
    <!-- 头部 -->
    <van-sticky>
      <div class="page-nav-bar panel">
        <!-- 搜索框  start -->
        <div class="wrapper" @click="inpSow">
          <input
            type="text"
            placeholder="type to search"
            :style="{ width: inpW + 'px' }"
            @click="inpSow"
            @focus="changeSpResult"
            @keydown.enter="enterSearch"
            v-model="searchText"
            ref="inp"
          />

          <a href="javascript:;" class="btn">
            <i class="iconfont icon-sousuo1" v-if="!isSearchShow"></i>
            <van-icon name="cross" v-else @click.stop="closeSearch" />
          </a>
        </div>
        <!-- 搜索框  end -->
        <div class="logo"></div>
        <!-- 搜索层弹出  start -->
        <van-popup
          v-model="isSearchShow"
          position="top"
          :style="{ height: '80%', top: '56px' }"
          :round="true"
          @click-overlay="closeSearch"
        >
          <SearchP
            ref="searchP"
            :searchText="searchText"
            @ChangeSearchText="ChangeSearchText"
          />
        </van-popup>
        <!-- 搜索层弹出 end -->
      </div>
    </van-sticky>
    <!-- 频道页 -->
    <div class="channel-tabs">
      <van-tabs v-model="active" animated swipeable :border="false">
        <van-tab v-for="item in channels" :key="item.id" :title="item.name">
          <!-- 列表列 -->
          <Articlelist class="article-list" :channelsId="item.id" />
        </van-tab>

        <!-- 占位作用 -->
        <div slot="nav-right" class="placeholder"></div>
        <div
          slot="nav-right"
          class="hamburger-btn"
          @click="isEditShow = !isEditShow"
        >
          <i class="iconfont icon-gengduo1"></i>
        </div>
      </van-tabs>
    </div>

    <!-- 频道编辑 -->
    <van-popup
      class="edit-channel-popup"
      v-model="isEditShow"
      position="right"
      :style="{ height: '100%', width: '75%' }"
      :round="true"
      closeable
      close-icon-position="top-right"
    >
      <ChannelEdit
        :channels="channels"
        :activeNum="active"
        @editActive="activeChange"
      />
    </van-popup>
    <!-- /频道编辑 -->
  </div>
</template>

<script>
import { getUserChannels } from "@/api/home";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";
import Articlelist from "@/components/ArticleList";
import ChannelEdit from "@/components/channel-edit";
import SearchP from "@/components/searchP";
export default {
  components: {
    Articlelist,
    ChannelEdit,
    SearchP,
  },
  data() {
    return {
      inpW: 0, //搜索条长度控制
      active: 0, //默认展示页
      // 4. 定义数据接收频道列表
      channels: [], //分类列表
      isEditShow: false, //默认是否显示频道编辑
      isSearchShow: false, //是否显示搜索页面
      searchText: "", //搜索内容
    };
  },
  methods: {
    //显示搜索界面
    inpSow() {
      this.inpW = 180;
      this.isSearchShow = true;
      this.$refs.inp.focus();
    },
    //关闭搜索界面
    closeSearch() {
      this.inpW = 0;
      this.isSearchShow = false;
    },
    //用于修改searchP中，结果显示的状态

    ChangeSearchText(val) {
      this.searchText = val;
    },
    //回车后搜索
    /**
     * 总结：
     *    -- 1、回车事件的原理，通过ref获取儿子身上的 enterSearch 事件，在该事件中设置isResultShow的值为true。
     *       当isResultShow的值为true是，子组件search-result就会显示，并且同时触发onLoad事件，自动获取。
     *    -- 2、这个方法利用了爷爷组件触发孙子组件身上的方法的原理。
     * */
    enterSearch() {
      this.$refs.searchP.enterSearch();
    },
    //更改searchP中，searchResult的显示状态
    /***
     *   -- tip：这里原本是想通过searchP中的wearch监听来改变isResultShow的值，但是当searchText的值改变时，
     *      如果将isResultShow = false代码写在wearch中，就会导致search-result组件界面显示不出来。因为点击变为true 了，
     *      但同时searchText的值也发生了变化，这就会引起wearch触发，从而又将sResultShow改为了false。
     *
     *  */
    changeSpResult() {
      this.$nextTick(() => {
        this.$refs.searchP.isResultShow = false;
      });
    },
    //获取列表
    async loadChannels() {
      try {
        if (this.user) {
          const { data } = await getUserChannels();

          this.channels = data.data.channels;
          console.log(this.channels);
        } else {
          this.channels = getItem("MyChannels");
        }
      } catch (error) {
        console.log("获取分类列表失败", error);
      }
    },
    //点击我的频道内的内容，显示到该页面
    activeChange(val) {
      this.active = val;
      this.isEditShow = false;
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    // 3. 调用获取频道列表

    this.loadChannels();
  },
};
</script>

<style scoped lang='less'>
/**
   /deep/得作用：
        1. 开启深度监视，默认对没有添加 data-v 属性得标签不监视，也就是说修改类是没有效果的
        2. 再scope模式下，自己写得类会再该标签上自动添加 “ data-v=‘xxxxx’ ”，此时直接写类名是可以起作用的，
        3. 想要修改不带 data-v属性 标签得类， 则需要添加/deep/ 
*/
.home-container {
  margin-bottom: 100px;

  .logo {
    width: 400px;
    height: 200px;
    background: url("../../assets/logo2.png") no-repeat;
    background-size: 100%;
    background-position-x: -60px;
    background-position-y: 53px;
  }
  .page-nav-bar {
    height: 100px;
    display: flex;
    justify-content: left;
    align-items: center;

    /deep/ .van-overlay {
      top: 112px;
    }
    .wrapper {
      position: absolute;
      z-index: 4000;
      right: 30px;
      background-color: #f3f3f3;
      border-radius: 20px;
      padding: 10px;

      input {
        border: none;
        background: none;
        outline: none;
        float: left;
        padding: 0;
        color: rgb(27, 27, 27);
        font-size: 25px;
        box-sizing: border-box;
        line-height: 40px;
        transition: all 0.3s;
      }

      .btn {
        display: flex;
        height: 40px;
        width: 50px;
        box-sizing: border-box;
        border-radius: 20px;
        background-color: #f3f3f3;
        justify-content: center;
        align-items: center;
        float: right;
        color: rgb(27, 27, 27);
        > * {
          font-size: 35px;
        }
      }
    }
  }
  /deep/.channel-tabs {
    .van-tab {
      min-width: 200px;
      height: 80px;
      .van-tab__text {
        font-size: 27px;
        color: #777777;
      }
      .artcile-list {
        height: 79vh;
        overflow: auto;
      }
    }
    .van-tabs {
      overflow: hidden;
      .van-tabs__content {
      }
    }
    .van-tabs__wrap {
      z-index: 100;
    }
    .van-tab--active .van-tab__text {
      color: #333 !important;
    }

    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background: rgba(50, 150, 250, 1);
      border-radius: 3px;
      bottom: 8px;
    }
    .van-tabs__nav {
      padding: 0;
    }
  }
  .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }
  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;
    i.toutiao {
      font-size: 33px;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0;
      width: 1px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
}
</style>