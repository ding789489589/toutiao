<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="看点啥"
      left-text=""
      @click-left="$router.back()"
    >
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-badge" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- //关注按钮 -->
          <!-- 自项父传值是，再在指令可以用$event 来接受子组件参数 -->
          <!-- <Follow
            :articleAut_id="article.aut_id"
            :isFollow="article.is_followed"
            @FollowChange="article.is_followed = $event"
          /> -->

          <!-- 这里注意：
                  -- 当同一个变量既要使用，又要修改的时候，就可以使用v-model来进行处理，原理就是利用了他的双向绑定原理 
                  -- 注意，这里用的是作者id，与下面不同

          -->
          <Follow
            :articleAut_id="article.aut_id"
            v-model="article.is_followed"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content"
          v-html="article.content"
          ref="artContent"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 评论区 start -->
        <ArticleComment
          :articleId="articleId"
          @totalCount="totalCount"
          :commentList="commentList"
          ref="article_list"
          @showReply="showReply"
        />
        <!-- 评论区 end -->

        <!-- 写评论弹窗 start  -->
        <van-popup v-model="isPostShow" position="bottom">
          <CommentPost :target="article.art_id" @post-success="onPostSuccess" />
        </van-popup>
        <!-- 写评论弹窗 end -->

        <!-- 评论回复弹窗 -->
        <van-popup
          v-model="isReplyShow"
          get-container="body"
          round
          position="bottom"
          :style="{ height: '80%' }"
        >
          <!-- 回复列表 -->
          <comment-reply
            :comment="currentComment"
            v-if="isReplyShow"
            @close="close"
            :target="article.art_id"
          />
          <!-- /回复列表 -->
        </van-popup>
        <!-- 评论回复弹窗 -->

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
          >
            写评论
          </van-button>

          <van-icon name="comment-o" :badge="commenTotalCount" color="#777" />
          <!-- //注意，这里传递的是文章id -->
          <ShouCang
            v-model="article.is_collected"
            :articleArt_id="article.art_id"
          />
          <Good v-model="article.attitude" :articleId="article.art_id" />

          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>

      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errState == 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleByID } from "@/api/article";
import { ImagePreview } from "vant";
import Follow from "./components/Follow.vue";
import ShouCang from "./components/shoucang.vue";
import Good from "./components/good.vue";
import ArticleComment from "./components/article-comment.vue";
import CommentPost from "./components/CommentPost";
import CommentReply from "./components/CommentReply.vue";

export default {
  name: "ArticleIndex",
  components: {
    Follow,
    ShouCang,
    Good,
    ArticleComment, //评论区
    CommentPost, //评论窗口
    CommentReply, //回复窗口
  },
  props: {
    //接受路由参数
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {}, // 文章详情
      isLoading: true, //是否是加载中
      errState: 0, //错误状态
      commenTotalCount: 0, //评论总数
      currentComment: {}, // 点击回复的那个评论对象
      isPostShow: false, //是否显示写评论窗口
      commentList: [], //评论总列表
      isReplyShow: false, //是否显示回复窗口
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle();
  },
  methods: {
    //加载文章
    async loadArticle() {
      try {
        //测试代码，模拟报错
        // if (Math.random() > 0.3) {
        //   JSON.parse("sfdaf");
        // }
        const { data } = await getArticleByID(this.articleId);
        this.article = data.data;
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errState = 404;
        } else {
          this.$toast("获取失败，清稍后重试");
          console.log(err);
        }
      }

      this.isLoading = false;
      //这里需要等vue将v-html中的结构数据渲染成dom后，在调用，否则会报错，找不到
      //并且还要注意要在isLoading = false 之后，这样v-html指令的那个dom结构才会渲染出来
      this.$nextTick(() => {
        this.previewImg();
        // console.log(this);
      });
    },

    //给每个图片添加一个事件，点击后能够查看大图，ImagePreview方法由vant提供
    previewImg() {
      // const artContent = this.$refs['artContent']
      const artContent = this.$refs.artContent;
      const img = artContent.querySelectorAll("img");
      const imgArr = [];
      console.log(img);
      img.forEach((item, index) => {
        imgArr.push(item.src);
        //事件回调函数是异步函数，所以同不代码结束后，也就是push所有后。当调用click事件时，此时的imgArr已经时push所有之后的数据
        item.addEventListener("click", function () {
          // console.log(imgArr);
          // console.log(index);
          ImagePreview({
            images: imgArr,
            // 预览图片的起始位置
            startPosition: index,
            // 点击关闭
            onClose() {
              // do something
            },
          });
        });
      });
    },
    //获取评论总数
    totalCount(count) {
      this.commenTotalCount = count;
    },

    //发布成功事件
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false;
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj);
      // console.log(this.$refs.article_list);
      // console.log("------------------");
      // this.$refs.article_list.onLoad();
    },
    //显示评论
    showReply(data) {
      this.currentComment = data;
      this.isReplyShow = true;
    },
    //关闭回复窗口
    close() {
      this.isReplyShow = false;
    },
  },
};
</script>

<style scoped lang="less">
.article-container {
  /deep/ .van-nav-bar {
    .van-icon {
      color: #fff;
    }
  }
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-badge {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-badge {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>