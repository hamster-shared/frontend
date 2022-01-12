
<template>

  <div>

    <!-- Orders List card -->
    <a-card :bordered="false" class="header-solid mb-24" :bodyStyle="{padding: 5, paddingTop: '16px'}">

      <!-- Table search -->
      <div class="mx-25">
        <a-row type="flex" :gutter="24">
          <a-col :span="24" class="text-right">
            <a-input-search :placeholder="$t('orderList.inputQueryOrderNumber')" style="max-width: 200px;" v-model="query" @change="onSearchChange" />
          </a-col>
        </a-row>
      </div>
      <!-- / Table search -->

      <!-- Orders table -->
      <a-table class="mt-20"
               :rowKey='record=>record.index'
               :columns="columns"
               :data-source="data"
               :pagination="{pageSize: pageSize}"
               :loading="loading"
      >

        <template slot="status" slot-scope="test,record">
          <a-button v-if="record.status === 'Finished'" shape="circle" size="small"
                    class="btn-status border-success mr-5">
            <a-icon class="m-0 text-success" type="check" style="font-size: 10px;"/>
          </a-button>
          <a-button v-else-if="record.status === 'Pending'" shape="circle" size="small"
                    class="btn-status border-muted mr-5">
            <a-icon class="m-0 text-muted" type="undo" style="font-size: 10px;"/>
          </a-button>
          <a-button v-else-if="record.status === 'Canceled'" shape="circle" size="small"
                    class="btn-status border-danger mr-5">
            <a-icon class="m-0 text-danger" type="close" style="font-size: 10px;"/>
          </a-button>
          <span style="vertical-align: middle;" v-if="record.status === 'Pending'"> {{ $t("orderList.processing") }} </span>
          <span style="vertical-align: middle;" v-if="record.status === 'Finished'"> {{ $t("orderList.completed") }} </span>
          <span style="vertical-align: middle;" v-if="record.status === 'Canceled'"> {{ $t("orderList.cancelled") }} </span>
        </template>

        <template slot="operate" slot-scope="test,record">
          <span v-if="record.status === 'Pending'" :loading="loading" @click="cancelOrder(record.index)">
            <a> {{ $t("orderList.cancelOrder") }} </a>
          </span>
        </template>

        <template slot="time.secs" slot-scope="time">
          <span>{{ setTime(time.toString().replace(/["|’|,|\“|\”|\，]/g, "")) }}</span>
        </template>

        <template slot="index" slot-scope="index">#{{ index }}</template>

      </a-table>
      <!-- / Orders table -->

    </a-card>
    <!-- / Orders List card -->

  </div>


</template>

<script>

// Sorting function for string attibutes.
import api from "../../api";
import {web3Enable, web3FromSource} from "@polkadot/extension-dapp";
import { mapGetters } from "vuex";


let stringSorter = function (a, b, attr) {
  if (a[attr] < b[attr])
    return -1;
  if (a[attr] > b[attr])
    return 1;
  return 0;
}

export default {
  mounted() {
    this.getList()
  },
  data() {
    return {
      // Table rows
      data: [],

      // Table page size
      pageSize: 8,

      // Table search query
      query: '',

      orders: [],
      loading: false,
    }
  },
  computed: {
    ...mapGetters("account", ["currentAccount"]),
    // Table columns
    columns() {
      return  [
        {
          title: this.$t("orderList.orderNumber"),
          dataIndex: 'index',
          sorter: (a, b) => a.index - b.index,
          sortDirections: ['descend', 'ascend'],
          scopedSlots: {customRender: 'index'},
        },
        {
          title: this.$t("orderList.resourceID"),
          dataIndex: 'resource_index',
          sorter: (a, b) => a.resource_index - b.resource_index,
          sortDirections: ['descend', 'ascend'],
          scopedSlots: {customRender: 'resource_index'},
        },
        {
          title: this.$t("orderList.creationＴime"),
          dataIndex: 'time.secs',
          sorter: (a, b) => a.index - b.index,
          sortDirections: ['descend', 'ascend'],
          scopedSlots: {customRender: 'time.secs'},

        },
        {
          title: this.$t("orderList.orderAmount"),
          dataIndex: 'price',
        },
        {
          title: this.$t("orderList.orderStatus"),
          dataIndex: 'status',
          sorter: (a, b) => stringSorter(a, b, 'status'),
          sortDirections: ['descend', 'ascend'],
          scopedSlots: {customRender: 'status'},
        },
        {
          title: this.$t("common.operator"),
          dataIndex: 'operate',
          scopedSlots: {customRender: 'operate'},

        },
      ]
    }
  },
  methods: {
    // Event listener for input change on table search field.
    onSearchChange() {
      if( this.query.length > 0 ) {
        api.then(t => t.query.resourceOrder.userOrders(this.currentAccount.address))
            .then(data => {
              return new Promise(function (resolve, reject) {
                resolve(data.toHuman())
              })
            })
            .then(data => api.then(t => t.query.resourceOrder.resourceOrders.multi(data)))
            .then(data => {
              return new Promise(function (resolve, reject) {
                resolve(data.map(t => t.toHuman()))
              })
            }).then(data => {
                let list = []
                for (let i in data) {
                  if (data[i].index === this.query){
                    list.push(data[i])
                  }
                }
                this.data = list
        })

      }
      else {
        this.getList();
      }
    },

    cancelOrder: function (i) {
      api
          .then(async t => {
            this.loading = true
            const extensions = await web3Enable("my cool dapp");
            let signature = await web3FromSource(
                this.currentAccount.meta.source
            );


            t.tx.resourceOrder.cancelOrder(i)
                .signAndSend(this.currentAccount.address, {signer: signature.signer}, ({status}) => {
                  if (status.isInBlock) {
                    this.getList(()=> this.loading = false)
                  }
                }).catch(error => {
                  console.log(error);
                  this.loading = false
                })

          }).catch(error => {
            console.log(error);
            this.loading = false
          })
    },

    setTime(str) {
      var n = parseInt(str) * 1000;
      var D = new Date(n);
      var year = D.getFullYear();//四位数年份

      var month = D.getMonth() + 1;//月份(0-11),0为一月份
      month = month < 10 ? ('0' + month) : month;

      var day = D.getDate();//月的某一天(1-31)
      day = day < 10 ? ('0' + day) : day;

      var hours = D.getHours();//小时(0-23)
      hours = hours < 10 ? ('0' + hours) : hours;

      var minutes = D.getMinutes();//分钟(0-59)
      minutes = minutes < 10 ? ('0' + minutes) : minutes;

      // var seconds = D.getSeconds();//秒(0-59)
      // seconds = seconds<10?('0'+seconds):seconds;
      // var week = D.getDay();//周几(0-6),0为周日
      // var weekArr = ['周日','周一','周二','周三','周四','周五','周六'];

      var now_time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
      return now_time;
    },

    getList(lodding) {
      if (this.currentAccount) {
        api.then(t => t.query.resourceOrder.userOrders(this.currentAccount.address))
            .then(data => {
              return new Promise(function (resolve, reject) {
                resolve(data.toHuman())
              })
            })
            .then(data => api.then(t => t.query.resourceOrder.resourceOrders.multi(data)))
            .then(data => {
              return new Promise(function (resolve, reject) {
                resolve(data.map(t => t.toHuman()))
              })
            }).then(data => {
          let list = []
          for (let i in data) {
            list.push(data[i])
          }
          this.data = list.reverse()
          if (lodding) {
            lodding()
          }
        })
      }
    }

  },

}


</script>

<style lang="scss" scoped>
.table-avatar-info {
  display: flex;
  align-items: center;
}
.table-avatar-info .ant-avatar {
  margin-right: 8px;
}

// Using vuejs "Deep Selectors"
.table-avatar-info::v-deep .ant-avatar-string {
  font-size: 12px;
}
.btn-status::v-deep .anticon {
  line-height: 0;
}
</style>
