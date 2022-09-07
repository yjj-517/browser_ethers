<template>
  <div id="Transaction">
    <h3>TransactionHash:{{ transactionHash }}</h3>
    <div class="blockBox" v-loading="loading">
      <div>
        <p>
          <span>hash:</span><span>{{ transactionArr.hash }}</span>
        </p>
        <p>
          <span>status:</span>
          <span v-if="transactionReceipt.status == 0"> 未完成 </span>
          <span v-if="transactionReceipt.status == 1"> 已完成 </span>
        </p>
        <p>
          <span>blockHash:</span><span>{{ transactionArr.blockHash }}</span>
        </p>
        <p>
          <span>blockNumber:</span><span>{{ transactionArr.blockNumber }}</span>
        </p>
      </div>
      <div>
        <p>
          <span>from:</span><span>{{ transactionArr.from }}</span>
        </p>
        <p>
          <span>to:</span><span>{{ transactionArr.to }}</span>
        </p>
        <p>
          <span>value:</span><span>{{ transactionArr.value }}</span>
        </p>
      </div>
      <div>
        <p>
          <span>gasLimit:</span><span>{{ transactionArr.gasLimit }}</span>
        </p>
        <p>
          <span>gasPrice:</span><span>{{ transactionArr.gasPrice }}</span>
        </p>
      </div>
      <div>
        <p>
          <span>chainId:</span>
          <span>
            {{ transactionArr.chainId }}
          </span>
        </p>
      </div>
      <div>
        <p>
          <span>contractAddress:</span>
          <span
            >{{ transactionReceipt.contractAddress }}
            (如果是一个合约创建交易,返回合约地址.)
          </span>
        </p>
      </div>
      <div>
        <p>
          <span>data:</span>
          <span>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="transactionArr.data"
            >
            </el-input>
          </span>
        </p>
      </div>
    </div>
    <div class="blockBox" v-loading="loading" v-if="transactionReceipt.logs">
      <div v-for="(item, index) in transactionReceipt.logs" :key="index">
        <p>
          <span>logIndex:</span><span>{{ item.logIndex }}</span>
        </p>
        <p>
          <span>address:</span><span>{{ item.address }}</span>
        </p>
        <p>
          <span>blockHash:</span><span>{{ item.blockHash }}</span>
        </p>
        <p>
          <span>blockNumber:</span><span>{{ item.blockNumber }}</span>
        </p>

        <div class="topics">
          <p>topics:</p>
          <p v-for="(t, i) in item.topics" :key="i" class="txs">
            <span>{{ i }}</span>
            <span>{{ t }}</span>
          </p>
        </div>
        <p>
          <span>data:</span
          ><span>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="item.data"
            >
            </el-input
          ></span>
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
      transactionHash: "", //交易hash
      transactionArr: {},
      transactionReceipt: {},
    };
  },
  // 方法
  methods: {
    async query() {
      this.loading = true;
      this.$emit("changdisabled", true);
      this.transactionArr = {};
      this.transactionReceipt = {};
      // 获取网络
      let url = this.ethnet.url;
      // console.log(url);
      const provider = new ethers.providers.JsonRpcProvider(url);
      // 0xe9c886e1b7d360f1a254df1095e36d0745dd0565b05e0196af60272df4a9a9b0
      try {
        // 通过交易hash获取交易状态
        let res = await provider.getTransactionReceipt(this.transactionHash);
        // console.log(res);
        this.transactionReceipt = res;
        // 通过交易hash获取交易详细
        let data = await provider.getTransaction(this.transactionHash);
        console.log(data);
        // 单位转换
        data.value = ethers.utils.formatUnits(data.value);
        // data.gasLimit = ethers.utils.formatUnits(data.gasLimit);
        data.gasPrice = ethers.utils.formatUnits(data.gasPrice);
        this.transactionArr = data;
        this.loading = false;
        this.$emit("changdisabled", false);
      } catch (e) {
        console.log(e);
        this.loading = false;
        this.$emit("changdisabled", false);
      }
    },
  },
  // 创建后
  created() {
    //接收数据
    this.transactionHash = this.$route.query.TransactionHash;
    this.query();
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
};
</script>

<style lang="less" scoped>
#Transaction {
  width: 80%;
  margin: 2rem 10%;
  background-color: #f8f9fa;
  h3 {
    line-height: 4rem;
    border-bottom: 1px solid #e7eaf3;
  }
  .blockBox {
    margin: 2rem 0;
    border: 1px solid #e7eaf3;
    border-radius: 1rem;
    background-color: #fff;
    div {
      border-bottom: 1px solid #e7eaf3;
    }
    p {
      display: flex;
      padding: 0 2rem;
      line-height: 3rem;
      // border-bottom: 1px solid #e7eaf3;
      span:nth-child(1) {
        width: 15%;
      }
      span:nth-child(2) {
        width: 80%;
      }
    }
    .topics {
      border-bottom: none;
      p.txs {
        margin-left: 20%;
        span:nth-child(1) {
          width: 5rem;
        }
      }
    }
  }
}
</style>