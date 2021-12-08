<template>
  <div>
    <van-cell-group>
      <van-cell title="搜索历史" center>
        <template v-if="isDelShow" #default>
          <span @click="historySearchList.splice(0, historySearchList.length)"
            >删除全部</span
          >
          &nbsp;&nbsp;&nbsp;
          <span @click="isDelShow = false">完成</span>
        </template>

        <van-icon
          slot="right-icon"
          v-else
          name="delete-o"
          @click="isDelShow = true"
        />
      </van-cell>
      <van-cell
        v-for="(item, index) in historySearchList"
        :key="index"
        :title="item"
        center
      >
        <van-icon
          name="close"
          v-show="isDelShow"
          @click="historySearchList.splice(index, 1)"
        />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  props: {
    historySearchList: {
      type: Array,
    },
  },
  data() {
    return {
      isDelShow: false,
    };
  },
  methods: {
    // delItem(){
    //
    // }
  },
};
</script>

<style>
</style>