 <template>
  <div id="Home">
    <!-- 搜索框 -->
    <div class="searchBox">
      <el-dropdown class="eldropdown" @command="handleCommand">
        <el-button type="primary" class="elbuttons">
          {{ searchName }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in searchList"
            :key="index"
            :command="item"
            >{{ item }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <el-input
        class="elinput"
        v-model="hashNum"
        placeholder="请输入内容"
        clearable
      ></el-input>
      <el-button class="elbutton" type="primary" @click="goSearch"
        >搜索</el-button
      >
    </div>
    <!-- Latest Blocks -->
    <div class="blocks boxstyle">
      <h3>Latest Blocks</h3>
      <div v-loading="loading1">
        <el-table :data="blockArr" stripe style="width: 100%">
          <el-table-column prop="number" label="number"> </el-table-column>
          <el-table-column prop="hash" label="hash"> </el-table-column>

          <el-table-column prop="gasUsed" label="gasUsed">
            <template slot-scope="scope">
              <span v-if="scope.row.gasUsed">{{
                scope.row.gasUsed.toNumber()
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gasLimit" label="gasLimit">
            <template slot-scope="scope">
              <span v-if="scope.row.gasLimit">{{
                scope.row.gasLimit.toNumber()
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="timestamp" label="timestamp">
            <template slot-scope="scope">
              <!-- <span>{{ scope.row.timestamp }}</span> -->
              <span
                >{{
                  new Date(
                    parseInt(scope.row.timestamp) * 1000
                  ).toLocaleString()
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="miner" label="miner"> </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- Latest Transactions -->
    <div class="transactions boxstyle">
      <h3>Latest Transactions</h3>
      <div v-loading="loading2">
        <el-table :data="transactionsArr" stripe style="width: 100%">
          <el-table-column prop="blockNumber" label="blockNumber">
          </el-table-column>
          <el-table-column prop="hash" label="hash"> </el-table-column>
          <el-table-column prop="from" label="from"> </el-table-column>
          <el-table-column prop="to" label="to"> </el-table-column>
          <el-table-column prop="value" label="value">
            <!-- <template slot-scope="scope">
              <span v-if="scope.row.value">{{
                scope.row.value.toNumber()
              }}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="gasLimit" label="gasLimit">
            <template slot-scope="scope">
              <span v-if="scope.row.gasLimit">{{
                scope.row.gasLimit.toNumber()
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="gasPrice" label="gasPrice">
            <template slot-scope="scope">
              <span v-if="scope.row.gasPrice">{{
                scope.row.gasPrice.toNumber()
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="nonce" label="nonce"></el-table-column>
          <el-table-column
            prop="transactionIndex"
            label="transactionIndex"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers"; //ethers.js
export default {
  name: "Home",
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
        // console.log(e);
        let url = e.url;
        // console.log(url);
        this.block(url);
      },
      // 立即处理 进入页面就触发
      immediate: true,
    },
  },
  // 数据
  data() {
    return {
      loading1: true,
      loading2: true,
      searchName: "All Filters", //搜索名字
      searchList: [
        "All Filters",
        "Addresses",
        "BlockHash",
        "BlockNumber",
        "transactionHash",
      ], //选择搜索
      hashNum: "", //搜索内容
      blockArr: [], //最新区块
      transactionsArr: [], //最新区块的交易
    };
  },

  // 方法
  methods: {
    //下拉框赋值
    handleCommand(command) {
      // console.log(command);
      this.searchName = command;
    },
    // 搜索按钮
    goSearch() {
      //去除前后空格
      this.hashNum = this.hashNum.trim();
      if (this.hashNum.length == 42) {
        this.$router.push({
          path: "/Address",
          query: { Address: this.hashNum },
        });
      } else if (/^\d+$/.test(this.hashNum)) {
        this.$router.push({
          path: "/Block",
          query: { BlockNumber: this.hashNum },
        });
      } else if (this.searchName == "BlockHash") {
        this.$router.push({
          path: "/Block",
          query: { BlockHash: this.hashNum },
        });
      } else if (this.hashNum.length == 66) {
        this.$router.push({
          path: "/Transaction",
          query: { TransactionHash: this.hashNum },
        });
      } else {
        this.$message({
          message: "请输入正确内容",
        });
      }
    },
    // 获取最新区块
    async block(url) {
      // 数据清空,网络选择禁用
      this.$emit("changdisabled", true);
      this.blockArr = [];
      this.transactionsArr = [];
      this.loading1 = true;
      this.loading2 = true;
      const provider = new ethers.providers.JsonRpcProvider(url);
      try {
        // 获取最新区块号
        let blockNum = await provider.getBlockNumber();
        // console.log(blockNum);
        // 通过递减获取最新十个区块信息
        for (let i = blockNum; i > blockNum - 10; i--) {
          await provider.getBlock(i).then((res) => {
            this.blockArr.push(res);
          });
        }
        this.loading1 = false;
        //获取最新区块的最新交易
        let blockHash = await provider.getBlock(blockNum);
        for (let i = 0; i < 10; i++) {
          // 通过交易hash返回交易对象
          await provider
            .getTransaction(blockHash.transactions[i])
            .then((res) => {
              // console.log(res);
              res.value = res.value.toString();
              this.transactionsArr.push(res);
            });
        }
        this.loading2 = false;
        this.$emit("changdisabled", false);
      } catch (e) {
        this.$emit("changdisabled", false);
        this.loading1 = false;
        this.loading2 = false;
        // this.$message.error("网络错误!");
      }
    },
  },
  // 创建后
  created() {},
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
};
</script>

<style lang="less" scoped>
#Home {
  background-color: #f8f9fa;
  .searchBox {
    padding: 5rem 10%;
    display: flex;
    background-color: #21325b;
    .eldropdown {
      width: 12rem;
      margin-right: -0.4rem;
      .elbuttons {
        width: 12rem;
      }
    }
    .el-input {
      width: 40rem;
    }
    .elbutton {
      width: 7rem;
      margin-left: -0.4rem;
    }
  }
  .boxstyle {
    border: 0.1rem solid #e7eaf3;
    border-radius: 1rem;
    margin: 3rem 10%;
    padding: 0 0 1rem 0;
    h3 {
      line-height: 4rem;
      margin-left: 2rem;
      border-radius: 1rem;
    }
  }
}
</style> 