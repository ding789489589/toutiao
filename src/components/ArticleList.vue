<template>
  <div class="article_content">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >
      <!-- 文章内容列表 -->
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
        class="artcile-list"
      >
        <van-cell
          v-for="(item, index) in list"
          :key="index"
          is-link
          :to="`/article/${item.art_id}`"
        >
          <!-- 文章标题 -->
          <div slot="title" class="title van-multi-ellipsis--l2">
            {{ item.title }}
          </div>
          <!-- 底部描述-自定义插槽 -->
          <div slot="label" class="label-info-wrap">
            <!-- 如果是三张图，则显示 -->
            <div v-show="item.cover.type === 3" class="cover-wrap">
              <div
                v-for="(imgItem, index) in item.cover.images"
                :key="index"
                class="cover-item"
              >
                <van-image class="cover-img" fit="contain" :src="imgItem" />
              </div>
            </div>

            <span>{{ item.aut_name }}</span>
            <span>{{ item.comm_count }}条评论</span>
            <span>{{ item.pubdate | relativeTime }}</span>
          </div>
          <!-- 右侧自定义内容-图片 -->
          <van-image
            v-if="item.cover.type === 1"
            slot="default"
            class="right-cover"
            fit="cover"
            :src="item.cover.images[0]"
          />
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/home";
export default {
  name: "ArticleList",
  props: {
    channelsId: {
      type: Number,
    },
  },
  data() {
    return {
      list: [], //文章列表
      loading: false, //加载中初始值
      finished: false, //加载完毕初始值
      refreshing: false, //默认下拉中
      refreshSuccessText: "", //成功提示
      timestamp: null,
      error: false, //是否提示更新失败
    };
  },
  methods: {
    // 当触发上拉加载更多的时候调用该函数
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channelsId, // 频道 id
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        });
        console.log(data);

        // timestamp是当前时间得上一个时间戳，用于后台换页用
        const { results } = data.data;
        this.list.push(...results);
        this.loading = false;
        if (results.length) {
          this.timestamp = results.per_timestamp;
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true;
        }
      } catch (err) {
        console.log(err);
        // 关闭loading状态
        this.loading = false;
        // 让报错
        this.error = true;
      }
    },
    //下拉刷新
    async onRefresh() {
      try {
        const { data } = await getArticles({
          channel_id: this.channelsId, // 频道 id
          timestamp: Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        });
        const { results } = data.data;
        console.log(results);
        this.list.unshift(...results);
        this.finished = false;
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`;
        this.refreshing = false;
      } catch (error) {
        console.log(error, "加载失败");
      }
    },
  },
};
</script>

<style scoped lang='less'>
.article_content {
  .artcile-list {
    height: 79vh;
    overflow: auto;
  }
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }

  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-wrap {
    background-color: #f3f3f3;
    padding: 10px 10px;
    margin-bottom: 15px;
    border-radius: 10px;
    box-shadow: 3px 3px 13px;
  }
}
</style>