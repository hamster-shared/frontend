<template>
	<div>
		<!-- Simple Datatable card -->
		<a-card :bordered="false" class="header-solid mb-24" :bodyStyle="{padding: 0, paddingTop: '16px'}">
      <div class="mx-25">
        <a-row type="flex" :gutter="24">
          <a-col :span="24" md="12" style="text-align: right">
            <a-button type="primary">{{ $t("shareResource.sharedResource") }}</a-button>
          </a-col>
        </a-row>
      </div>
			<div class="mx-25">
				<a-row type="flex" :gutter="24">
					<a-col :span="8" md="12">
            <label class="ml-10">{{ $t("shareResource.resourceID")+ ": " }}</label>
            <a-input  v-model="condition.resourceId" style="width: 200px" :placeholder="$t('shareResource.resourceID')" />
					</a-col>
          <a-col :span="8" md="12">
            <label class="ml-10">{{ $t("shareResource.resourceStatus")+ ": " }} </label>
            <a-select v-model="condition.status" allowClear style="width: 200px"  show-search  :placeholder="$t('common.pleaseSelect')">
              <a-select-option v-for="item in stateList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </a-col>
					<a-col :span="8" md="12">
            <a-button type="primary" @click="query">{{$t("common.query")}}</a-button>
            &nbsp;
            <a-button @click="resetCondition">{{ $t("common.reset") }}</a-button>
					</a-col>
				</a-row>
			</div>
			<a-table class="mt-20" :columns="columns" :data-source="computedTableData" rowKey="index" :pagination="{pageSize: pageSize,}" >
        <label slot="memory" slot-scope="memory">{{ memory }}GB</label>
        <label slot="status" slot-scope="status">{{stateLabel(status)}}</label>
        <label slot="endOfRent" slot-scope="blockNumber">{{blockNumberToTime(blockNumber,blockSate)}}</label>
        <span slot="action" slot-scope="text, record">
          <a @click="openPriceForm(record)">{{ $t("shareResource.changePrice") }}</a>
          <a-divider type="vertical" />
          <a @click="openTimeForm(record)">{{ $t("shareResource.increaseDuration") }}</a>
          <a-divider v-if="record.status === 'Offline'" type="vertical" />
          <a v-if="record.status === 'Offline'" href="#" @click="handleLease(record)">{{ $t("shareResource.lease") }}</a>
          <a-divider type="vertical" />
          <a v-if="record.status === 'Unused' || record.status === 'Offline'" href="#" @click="confirmDelete(record)">{{$t("common.delete")}}</a>
          <a v-else>{{ $t("shareResource.viewOrder") }}</a>
        </span>
      </a-table>
		</a-card>
		<!-- / Simple Datatable card -->

    <!-- set price form modal -->
    <a-modal  v-model="setPriceModel" :footer="null" :forceRender="true" :title="$t('shareResource.changePrice')" on-ok="setPriceModel = false">
      <a-spin :spinning="setPriceSpinning" :tip="setPriceTip">
        <a-form
          :form="setPriceForm"
          :hideRequiredMark="true"
          @submit.prevent="handleUpdateRecordFormSubmit"
      >
        <a-row :gutter="[24]">
          <a-col :span="24">

            <a-form-item class="mb-10" :colon="false">
              <a-input type="hidden" v-decorator="['index',]"></a-input>
              <a-input readOnly  v-decorator="[
										'oldPrice',
										{ rules: [{ required: true, message: $t('shareResource.inputOldPrice')}] },
									]"
                        :placeholder="$t('shareResource.oldUnitPrice')"/>

              <balance-input ref="newPriceRef" :placeholder="$t('shareResource.newUnitPrice')"></balance-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
          </a-col>
          <a-col :span="12" class="text-right">
            <a-button key="submit" class="px-30" size="small" type="primary" htmlType="submit">{{ $t("common.submit") }}</a-button>
            <a-button key="back" @click="setPriceModel = false" class="px-30 ml-10" size="small">{{ $t("common.cancel") }}</a-button>
          </a-col>
        </a-row>
      </a-form>
      </a-spin>
    </a-modal>
    <!-- /  set price form modal -->

    <!-- set time form modal -->
    <a-modal  v-model="setTimeModel" :footer="null" :forceRender="true" :title="$t('shareResource.increaseDuration')" on-ok="setTimeModel = false">
      <a-spin :spinning="setTimeSpinning" :tip="setTimeTip">
        <a-form
            :form="setTimeForm"
            :hideRequiredMark="true"
            @submit.prevent="handleUpdateTimeFormSubmit"
        >
          <a-row :gutter="[24]">
            <a-col :span="24">
              <a-form-item class="mb-10" :colon="false">
                <a-input type="hidden" v-decorator="['index',]"></a-input>
                <a-input
                    addon-after="h"
                    v-decorator="[
										'duration',
										{ rules: [{ required: true, message: $t('shareResource.inputIncreaseDuration')}] },
									]"
                    :placeholder=" $t('shareResource.increaseDuration')">
                  <a-icon slot="prefix" type="edit" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
            </a-col>
            <a-col :span="12" class="text-right">
              <a-button key="submit" class="px-30" size="small" type="primary" htmlType="submit">{{ $t("common.submit") }}</a-button>
              <a-button key="back" @click="setTimeModel = false" class="px-30 ml-10" size="small">{{ $t("common.cancel") }}</a-button>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
    <!-- / set time form modal -->
  </div>
</template>

<script>
  import api from "../../api"
  import {mapGetters} from "vuex";
  import { web3FromSource, web3Enable } from "@polkadot/extension-dapp";
  import {getCurrentBlockState,blockNumberToTime} from "@/utils/block"
  import BalanceInput from "@/components/BalanceInput/BalanceInput"
  import {message} from "ant-design-vue";
	// First table's list of columns.
	export default {
		components: {
      BalanceInput,
		},
		data() {
			return {
				// First table's number of rows per page.
				pageSize: 10,
        condition: {
          resourceId: '',
          status: '',
        },
        tableData: [],
        setPriceModel: false,
        setPriceSpinning: false,
        setPriceTip: "",
        setPriceForm: this.$form.createForm(this, { name: 'setPriceForm' }),
        setTimeModel: false,
        setTimeSpinning: false,
        setTimeTip: "",
        setTimeForm: this.$form.createForm(this, { name: 'setPriceForm' }),
        blockSate: undefined,
			}
		},
		methods: {
      //Query all shared resource information under personal account
      query() {
        if (this.currentAccount) {
          let address = this.currentAccount.address
          api
              .then(t => t.query.provider.provider(address))
              .then(data => {
                return new Promise(function (resolve, reject) {
                  let result = data.toJSON()
                  if (result.length > 0) {
                    resolve(data.toJSON())
                  }else {
                    reject(new Error('no data'))
                  }
                })
              })
              .then(data => api.then(t => t.query.provider.resources.multi(data)))
              .then(data => {
                return new Promise(function (resolve, reject) {
                  resolve(data.map(t => {
                    let r = t.toHuman()
                    return r
                  }))
                })
              })
              .then(data => {
                this.tableData = data
              })
              .catch(err => {
                this.tableData = []
          })
        }else {
          this.$message.warning(this.$t("shareResource.connectWalletTip"))
        }
      },
      // Redo query criteria
      resetCondition(){
        this.condition = {
          resourceId: '',
          status: '',
        }
      },
      // Query current block time
      async now(){
        const lastHdr = await api.rpc.chain.getHeader();
        const momentPrev = await api.query.timestamp.now.at(lastHdr.parentHash);
        console.log(momentPrev)
      },
      // Display the value of the status according to the key
      stateLabel(key){
        let statusObj = this.stateList.find(t => t.value === key)
        if (statusObj){
          return statusObj.label
        }else {
          return ""
        }
      },
      openPriceForm(record){
        this.setPriceForm.setFieldsValue({
          index: record.index,
          oldPrice: record.rental_info.rent_unit_price
        })
        this.setPriceModel = true
      },
      openTimeForm(record){
        this.setTimeForm.setFieldsValue({
          index: record.index,
        })
        this.setTimeModel = true
      },
      // Event handler for modify unit price.
      handleUpdateRecordFormSubmit(e) {
        let vue_ = this
        this.setPriceForm.validateFields( async (err, values) => {
          if ( !err ) {
            // Blockchain transactions
            web3Enable("my cool dapp")
                .then(result => {
                  return web3FromSource(
                      vue_.currentAccount.meta.source
                  );
                }).then(signature => {
                  return Promise.all([signature,api])
            }).then(data =>{
                 vue_.setPriceSpinning = true
                return new Promise((resolve,reject) => {
                      let signature= data[0]
                      let apiPromise = data[1]
                      let newPrice = vue_.$refs.newPriceRef.getPrice()
                      if(newPrice === '' || isNaN(newPrice)){
                        reject(this.$t("shareResource.inputUnitPriceTip"))
                        return
                      }
                      let submitExtrinsic =  apiPromise.tx.provider.modifyResourcePrice(values.index,newPrice)

                      submitExtrinsic.signAndSend(vue_.currentAccount.address,{ signer: signature.signer },({events = [], status}) => {
                  let obj = status.toHuman()
                  if (typeof obj === 'string'){
                    vue_.setPriceTip = status.toHuman()
                  } else {
                    vue_.setPriceTip = Object.keys(obj)[0]
                  }
                  if(obj.InBlock){
                    console.log('InBlock')
                    events.forEach(({ event: { data, method, section }, phase },index,array) => {
                      if(method === "ExtrinsicFailed"){
                        reject(this.$t("shareResource.modifyUnitPriceFailed"))
                      }
                      if (index === array.length -1){
                        vue_.query()
                        resolve();
                      }
                    });
                  }
                }).catch(err => {
                    reject(err.message)
                    })
                })
            }).then(() => {
              vue_.setPriceSpinning = false
              vue_.setPriceModel = false
              vue_.$message.success(this.$t("shareResource.modifyUnitPriceSuccess"))
              vue_.query()
            }).catch( err => {
              vue_.$message.warning(err.message)
            }).finally(() => {
              vue_.setPriceSpinning = false
            })
          }
        });
      },
      // Event handler for increase duration.
      handleUpdateTimeFormSubmit(e) {
        let vue_ = this
        this.setTimeForm.validateFields( async (err, values) => {
          if ( !err ) {
            // Blockchain transactions
            web3Enable("my cool dapp")
                .then(result => {
                  return web3FromSource(
                      vue_.currentAccount.meta.source
                  );
                }).then(signature => {
              return Promise.all([signature,api])
            }).then(data =>{
              vue_.setTimeSpinning = true
              return new Promise((resolve,reject) => {
                let signature= data[0]
                let apiPromise = data[1]
                let submitExtrinsic =  apiPromise.tx.provider.addResourceDuration(values.index,values.duration)

                submitExtrinsic.signAndSend(vue_.currentAccount.address,{ signer: signature.signer },({events = [], status}) => {
                  let obj = status.toHuman()
                  if (typeof obj === 'string'){
                    vue_.setTimeTip = status.toHuman()
                  } else {
                    vue_.setTimeTip = Object.keys(obj)[0]
                  }

                  if(obj.InBlock){
                    events.forEach(({ event: { data, method, section }, phase },index,array) => {
                      if(method === "ExtrinsicFailed"){
                        reject(this.$t("shareResource.increaseDurationFailed"))
                      }
                      if (index === array.length -1){
                        vue_.query()
                        resolve();
                      }
                    });
                  }
                }).catch(err => {
                  reject(this.$t("shareResource.increaseDurationFailed"))
                })
              }).then(() => {
                vue_.setTimeModel = false
                vue_.$message.success(this.$t("shareResource.increaseDurationSuccess"))
              }).catch(err => {
                vue_.$message.warning(this.$t("shareResource.increaseDurationFailed"))
              }).finally(() => {
                vue_.setTimeSpinning = false
              })
            })
          }
        });
      },
      handleLease(record) {
        let vue_ = this
        console.log(record)
        this.$confirm({
          title: this.$t("shareResource.confirmLease"),
          onOk() {
            console.log('OK');
            // Blockchain transactions
            return new Promise((resolve, reject)=> {
              web3Enable("my cool dapp")
                  .then(result => {
                    return web3FromSource(
                        vue_.currentAccount.meta.source
                    );
                  }).then(signature => {
                return Promise.all([signature,api])
              }).then(data =>{
                let signature= data[0]
                let apiPromise = data[1]

                let submitExtrinsic =  apiPromise.tx.provider.changeResourceStatus(record.index)
                submitExtrinsic.signAndSend(vue_.currentAccount.address,{ signer: signature.signer },({events = [], status}) => {
                  let obj = status.toHuman()
                  if (typeof obj === 'string'){
                    console.log(status.toHuman())
                  } else {
                    console.log(Object.keys(obj)[0])
                  }

                  if(obj.InBlock){
                    events.forEach(({ event: { data, method, section }, phase },index,array) => {
                      console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                      if(method === "ExtrinsicFailed"){
                        vue_.$message.warning(this.$t("shareResource.operationFailed"))
                        reject(this.$t("shareResource.operationFailed"))
                      }
                      if (index === array.length -1){
                        vue_.query()
                        resolve();
                      }
                    });
                  }
                })
              }).catch(err => {
                vue_.$message.warning(this.$t("shareResource.operationFailed"))
              })
            })

          },
          onCancel() {
            console.log('Cancel');
          },
          class: 'test',
        });
      },
      confirmDelete(record){

        let vue_ = this
        console.log(record)
        this.$confirm({
          title: this.$t("shareResource.confirmDeletion"),
          content: h => <div style="color:red;">You are deleting the resource with ID {record.index},system is {record.config.system},specification is {record.config.cpu} nucleus {record.config.memory}G,confirm deletion？ </div>,
          onOk() {
            console.log('OK');
            // Blockchain transactions
            return new Promise((resolve, reject)=> {
              web3Enable("my cool dapp")
                  .then(result => {
                    return web3FromSource(
                        vue_.currentAccount.meta.source
                    );
                  }).then(signature => {
                return Promise.all([signature,api])
              }).then(data =>{
                let signature= data[0]
                let apiPromise = data[1]

                let submitExtrinsic =  apiPromise.tx.provider.removeResource(record.index)
                submitExtrinsic.signAndSend(vue_.currentAccount.address,{ signer: signature.signer },({events = [], status}) => {
                  let obj = status.toHuman()
                  if (typeof obj === 'string'){
                    console.log(status.toHuman())
                  } else {
                    console.log(Object.keys(obj)[0])
                  }

                  if(obj.InBlock){
                    events.forEach(({ event: { data, method, section }, phase },index,array) => {
                      console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                      if(method === "ExtrinsicFailed"){
                        vue_.$message.warning(this.$t("shareResource.deletionFailed"))
                        reject(this.$t("shareResource.deletionFailed"))
                      }
                      if (index === array.length -1){
                        vue_.query()
                        resolve();
                      }
                    });
                  }
                })
              }).catch(err => {
                vue_.$message.warning(this.$t("shareResource.deletionFailed"))
              })
            })

          },
          onCancel() {
            console.log('Cancel');
          },
          class: 'test',
        });
      },
      blockNumberToTime,
		},
    computed: {
		  // Filtered list data
		  computedTableData(){
		    let data = this.tableData
		    if (this.condition.resourceId){
		      data = data.filter(t => t.index === this.condition.resourceId)
        }
		    if (this.condition.status) {
		      data = data.filter(t => t.status === this.condition.status)
        }
		    return data
      },
      // First table's list of columns.
      columns() {
        return  [
          {
            title: this.$t("shareResource.resourceID"),
            dataIndex: 'index',
            key: 'index',
            sorter: (a, b) => a.index - b.index ,
            sortDirections: ['descend', 'ascend'],
          },
          {
            title: this.$t("market.cpuModel"),
            dataIndex: 'config.cpu_model',
            key: "cpu_model",
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => ('' + a.config.cpu_model).localeCompare(b.config.cpu_model),
          },
          {
            title: this.$t("shareResource.cpuCounts"),
            dataIndex: 'config.cpu',
            key: 'cpu',
            sorter: (a, b) => a.config.cpu - b.config.cpu,
            sortDirections: ['descend', 'ascend'],
          },
          {
            title: this.$t("market.memory"),
            dataIndex: 'config.memory',
            key: 'memory',
            sorter: (a, b) => a.config.memory - b.config.memory,
            sortDirections: ['descend', 'ascend'],
            scopedSlots: { customRender: 'memory' },
          },
          {
            title: this.$t("market.system"),
            dataIndex: 'config.system',
            key: 'system',
            sorter: (a, b) => a.config.system.length - b.config.system.length,
            sortDirections: ['descend', 'ascend'],
          },
          {
            title: this.$t("market.priceInfo"),
            dataIndex: 'rental_info.rent_unit_price',
            key: 'rentUnitPrice',
            sorter: (a, b) => a.rental_info.rent_unit_price - b.rental_info.rent_unit_price,
            sortDirections: ['descend', 'ascend'],
          },
          {
            title: this.$t("shareResource.expirationTime"),
            dataIndex: 'rental_info.end_of_rent',
            key: 'endOfRent',
            sorter: (a, b) => a.rental_info.end_of_rent - b.rental_info.end_of_rent,
            scopedSlots: {customRender: 'endOfRent'},
            sortDirections: ['descend', 'ascend'],
          },
          {
            title: this.$t("shareResource.resourceStatus"),
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.length - b.status.length,
            scopedSlots: { customRender: 'status' },
            sortDirections: ['descend', 'ascend'],
          },
          {
            title: this.$t("common.operator"),
            key: 'action',
            scopedSlots: { customRender: 'action' },
          }
        ]
      },
      stateList() {
        return [
          {value : "Unused",label: this.$t("shareResource.unused") },
          {value : "Locked",label: this.$t("shareResource.locked") },
          {value : "Inuse",label: this.$t("shareResource.inuse")},
          {value : "Offline",label: this.$t("shareResource.offline") },
        ]
      },
      ...mapGetters("account", ["currentAccount"]),
    },
    mounted() {
		  getCurrentBlockState().then(bs => {
		    this.blockSate = bs
        this.query()
      })

    }
  }

</script>

<style lang="scss">
</style>
