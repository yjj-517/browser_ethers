 <template>
  <div id="app">
    <div class="app_box">
      <div class="head_box">
        <h2>区块链浏览器</h2>
        <div>
          <span>网络选择:</span>
          <el-select
            v-model="ethernetsNum"
            placeholder="请选择"
            @change="changeValue($event)"
            :disabled="disabled"
          >
            <el-option
              v-for="(item, index) in ethernets"
              :key="index"
              :label="item.name"
              :value="index"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <router-view :ethnet="ethnet" v-on:changdisabled="changdisabled" />
  </div>
</template>

<script>
import ethernet from "@/assets/js/ethernet.json"; //获取网络json文件
export default {
  name: "app",
  // 模板引入
  components: {},
  // 数据
  data() {
    return {
      ethernets: [], //获取网络
      ethernetsNum: "", //网络选择index
      ethnet: [], //网络
      disabled: false, //选择器禁用
    };
  },
  // 方法
  methods: {
    // 选择器改变的值
    changeValue(num) {
      // console.log(num);
      this.ethnet = this.ethernets[num];
      // console.log(this.ethnet);
    },
    //监听子组件的值
    changdisabled(res) {
      // console.log(res);
      this.disabled = res;
    },
  },
  // 创建后
  created() {
    // 获取网络json文件
    this.ethernets = ethernet;
    // console.log(this.ethernets);
    this.ethernetsNum = 0;
    this.ethnet = this.ethernets[this.ethernetsNum];
  },
  // 挂载后
  mounted() {},
  // 更新后
  updated() {},
};
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  background-color: #f8f9fa;
  .app_box {
    line-height: 7rem;
    background-color: #fff;
    border-bottom: 1px solid #e7eaf3;
    .head_box {
      margin: 0 10%;
      display: flex;
      justify-content: space-between;
      div {
        span {
          margin-right: 1rem;
        }
        .el-select {
          width: 10rem;
          height: 2rem;
        }
      }
    }
  }
}
</style> 

