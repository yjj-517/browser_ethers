<template>
  <div id="Block">
    <div class="blockBox">
      <h3 v-if="blockHash">blockHash:{{ blockHash }}</h3>
      <h3 v-if="blockNumber">blockNumber:{{ blockNumber }}</h3>
      <div class="blockArrBox" v-loading="loading">
        <p>
          <span>hash:</span><span>{{ blockArr.hash }}</span>
        </p>
        <p>
          <span>blockNumber:</span><span>{{ blockArr.number }}</span>
        </p>
        <p>
          <span>timestamp:</span
          ><span>{{
            new Date(parseInt(blockArr.timestamp) * 1000).toLocaleString()
          }}</span>
        </p>
        <p>
          <span>transactions:</span
          ><span v-if="blockArr.transactions">{{
            blockArr.transactions.length
          }}</span>
        </p>
        <p>
          <span>miner:</span><span>{{ blockArr.miner }}</span>
        </p>
        <p>
          <span>gasUsed:</span><span>{{ blockArr.gasUsed }}</span>
        </p>
        <p>
          <span>gasLimit:</span><span>{{ blockArr.gasLimit }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers"; //ethers.js
export default {
  name: "Block",
  // 模板引入
  components: {},
  props: {
    ethnet: {
      type: null,
    },
  },
  watch: {
    // 监听网络改变
    ethnet: {
      handler(e) {
        this.ethnet = e;
        this.query();
      },
      // 立即处理 进入页面就触发
      // immediate: true,
    },
  },
  // 数据
  data() {
    return {
      loading: false,
      blockHash: "", //区块hash
      blockNumber: "", //区块高度
      blockArr: {}, //区块消息
    };
  },
  // 方法
  methods: {
    async query() {
      this.loading = true;
      this.$emit("changdisabled", true);
      this.blockArr = {};
      let url = this.ethnet.url;
      // console.log(url);
      const provider = new ethers.providers.JsonRpcProvider(url);
      let blockNum = "";
      if (this.blockHash) {
        blockNum = this.blockHash;
      } else if (this.blockNumber) {
        blockNum = this.blockNumber * 1;
      }
      // 通过区块高度或者hash获取区块详细;
      try {
        let res = await provider.getBlock(blockNum);
        this.blockArr = res;
        this.$emit("changdisabled", false);
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.$emit("changdisabled", false);
        this.loading = false;
      }
    },
  },
  // 创建后
  created() {
    //接收数据区块hash或者区块高度
    this.blockHash = this.$route.query.BlockHash;
    this.blockNumber = this.$route.query.BlockNumber;
    this.query();
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
};
</script>

<style lang="less" scoped>
#Block {
  width: 80%;
  margin: 2rem 10%;
  border: 1px solid #e7eaf3;
  border-radius: 2rem;
  background-color: #fff;
  .blockBox {
    margin: 0 2rem;
    h3 {
      line-height: 4rem;
      border-bottom: 1px solid #e7eaf3;
    }
    .blockArrBox {
      p {
        display: flex;
        line-height: 3rem;
        border-bottom: 1px solid #e7eaf3;
        span:nth-child(1) {
          width: 20%;
        }
      }
    }
  }
}
</style>