<template>
  <!-- 账号详情页 -->
  <div id="Address">
    <h3>Address:{{ address }}</h3>
    <div class="addressBox" v-loading="loading">
      <p v-if="bytecode == '0x'" class="a">Overview</p>
      <p v-if="bytecode !== '0x'" class="a">Contract Overview</p>
      <p>Balance: {{ balance }} ether</p>
      <p>transactionCount: {{ transactionCount }}</p>
      <p v-if="bytecode !== '0x'">
        Bytecode:<el-input
          class="textarea"
          type="textarea"
          :rows="6"
          placeholder="请输入内容"
          v-model="bytecode"
        >
        </el-input>
      </p>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers"; //ethers.js
export default {
  name: "Address",
  // 模板引入
  components: {},
  props: {
    ethnet: {
      type: null,
    },
  },

  // 数据
  data() {
    return {
      loading: false, //加载
      address: "", //账户
      balance: "0", //余额
      transactionCount: "", //交易次数
      bytecode: "0x", //合约字节码
      addressArr: [], //交易记录
    };
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
  // 方法
  methods: {
    async query() {
      this.loading = true;
      this.$emit("changdisabled", true);
      let url = this.ethnet.url;
      // console.log(url);
      const provider = new ethers.providers.JsonRpcProvider(url);
      try {
        // 获取合约详情
        await provider.getCode(this.address).then((res) => {
          // console.log(res);
          this.bytecode = res;
        });
        // 获取余额
        await provider.getBalance(this.address).then((res) => {
          // console.log(res);
          this.balance = ethers.utils.formatEther(res);
        });
        // 获取交易次数
        await provider.getTransactionCount(this.address).then((res) => {
          // console.log(res);
          this.transactionCount = res;
        });
        this.$emit("changdisabled", false);
        this.loading = false;
      } catch (e) {
        this.$emit("changdisabled", false);
        this.loading = false;
      }
    },
  },
  // 创建后
  created() {
    //接收数据，账户hash
    console.log(this.$route.query.Address);
    this.address = this.$route.query.Address;
    this.query();
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
};
</script>

<style lang="less" scoped>
#Address {
  width: 100%;
  margin: 0 10%;
  h3 {
    line-height: 5rem;
    border-bottom: 1px solid #e7eaf3;
  }
  .addressBox {
    margin: 2rem 0 0;
    border: 1px solid #e7eaf3;
    width: 50rem;
    border-radius: 1rem;
    background-color: #fff;
    p {
      padding: 0 1rem;
      line-height: 3rem;
      border-bottom: 1px solid #e7eaf3;
      &.a {
        font-weight: bold;
      }
    }
  }
}
</style> 