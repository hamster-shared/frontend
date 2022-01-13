
<template>
  <a-spin :spinning="receiveAllLoading">
    <div>
      <a-card :bordered="false" class=" header-solid custom-card-spacing mb-24">
        <div style="display: flex;justify-content: space-between;align-items: center">
          <div class="col-info">
            <a-descriptions  :column="1">
              <a-descriptions-item :label="$t('leaseContract.totalPledgeAmount')">
                {{showPrice(staking.amount)}}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('leaseContract.activePledgeAmount')">
                {{showPrice(staking.activeAmount)}}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('leaseContract.lockedPledgeAmount')">
                {{showPrice(staking.lockAmount)}}
              </a-descriptions-item>
            </a-descriptions>
          </div>
          <div class="custom-col-action">
            <a-button type="primary" size="small" @click="showStakingModal('staking')" style="color: white">
              {{ $t("leaseContract.pledgeAmount") }}
            </a-button>
            <a-button type="primary" size="small" @click="showStakingModal('withdraw')" style="color: white;margin-left: 16px">{{ $t("leaseContract.reclaimPledge") }}</a-button>
          </div>
        </div>
      </a-card>
      <a-card :bordered="false" class="header-solid mb-24 custom-card-spacing" :bodyStyle="{padding: 0, paddingTop: '16px'}">
        <template #title>
          <div class="service-list-title">
            <div>
              <h5 class="font-semibold">{{ $t("leaseContract.serviceList") }}</h5>
              <div>{{ $t("leaseContract.currentBlock") }}{{currentBlock}}</div>
              <div>{{ $t("leaseContract.dropPrompt") }}</div>
            </div>
            <a-button class="receive-btn" @click="receiveAllIncome">{{ $t("leaseContract.receiveAllIncome") }}</a-button>
          </div>
        </template>
        <a-table class="mt-20" :columns="columns2" :data-source="data2"   :row-key="record => record.index" :loading="receiveLoading">
          <template slot="price" slot-scope="text, record, index">
            <span>{{showPrice(record.price)}}</span>
          </template>
          <template slot="recoverableAmount" slot-scope="text, record, index">
            <span>{{showPrice(record.receive_amount)}}</span>
          </template>
          <template slot="penaltyAmount" slot-scope="text, record, index">
            <span>{{showPrice(record.penalty_amount)}}</span>
          </template>
          <template slot="operation" slot-scope="text, record, index">
            <a-button type="link"  @click="receiveIncome(record)" :disabled="record.receive_amount === 0 ? true : false">{{ $t("leaseContract.receiveIncome") }}</a-button>
          </template>
        </a-table>
      </a-card>
      <a-modal v-model="visible" :title="title" :maskClosable="false" :footer="null" :centered="true" :closable="false">
        <a-spin :spinning="stakingLoading">
          <div class="staking-content">
            <span class="title">{{ $t("leaseContract.pledgeAmount") }}：</span>
            <Input :placeholder="placeholder" :changeClick = "checkStakingAmount" ref="inputRef"/>
          </div>
          <span class="form-error-tip" v-if="stakingAmountTip">{{ $t("leaseContract.amountNotBlank") }}</span>
          <div class="staking-footer">
            <a-button class="staking-btn-close" @click="close">{{ $t("common.cancel") }}</a-button>
            <a-button class="staking-btn-ok" @click="ok">{{ $t("common.determine") }}</a-button>
          </div>
        </a-spin>
      </a-modal>
    </div>
  </a-spin>
</template>

<script>
import api from "../../api/index.js"
import { web3FromSource, web3Enable } from "@polkadot/extension-dapp";
import {mapGetters} from "vuex";
import Input from "../../components/BalanceInput/BalanceInput";
	export default ({
		data() {
			return {
        currentBlock: "",
        stakingLoading: false,
        receiveAllLoading: false,
        receiveLoading: false,
        title:"",
        placeholder:"",
        activeModal: "",
        //Pledge information
        staking: {
          //Pledge amount
          amount: 0,
          //Active pledge amount
          activeAmount: 0,
          //Locked pledge amount
          lockAmount: 0
        },
        visible: false,
        stakingAmountTip:false,
        stakingAmountErr: "",
        data2:[]
			}
		},
    components: {
      Input
    },
    computed: {
      ...mapGetters("account", ["currentAccount"]),
      ...mapGetters("polkadot", ["api"]),
      showPrice() {
        return function (price) {
          if (price === "" || price === 0) {
            return "0 Unit"
          }
          return this.api.registry.createType('Balance', BigInt(price)).toHuman()
        }
      },
      columns2() {
        return [
          {
            title: this.$t("leaseContract.resourceID"),
            dataIndex: 'resource_index',
            align: "center"
          },
          {
            title: this.$t("leaseContract.serviceNumber"),
            dataIndex: 'index',
            align: "center"
          },
          {
            title: this.$t("leaseContract.serviceStartBlock"),
            dataIndex: 'start',
            align: "center"
          },
          {
            title: this.$t("leaseContract.serviceEndBlock"),
            dataIndex: 'end',
            align: "center"
          },
          {
            title: this.$t("leaseContract.lastReportedBlock"),
            dataIndex: 'calculation',
            align: "center"
          },
          {
            title: this.$t("leaseContract.orderAmount"),
            dataIndex: 'price',
            scopedSlots: { customRender: 'price' },
            align: "center"
          },
          {
            title: this.$t("leaseContract.recoverableAmount"),
            dataIndex: 'recoverableAmount',
            scopedSlots: { customRender: 'recoverableAmount' },
            align: "center"
          },
          {
            title: this.$t("leaseContract.penaltyAmount"),
            dataIndex: 'penaltyAmount',
            scopedSlots: { customRender: 'penaltyAmount' },
            align: "center"
          },
          {
            title: this.$t("common.operator"),
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
            align: "center"
          },
        ]
      }
    },
    methods: {
      //Get service list
      async getServiceLists() {
        //polkaApi
        if (this.currentAccount) {
          let API = await api;
          this.receiveLoading = true;
          //Query the resource ID associated with the user
          //Query the lease agreement number corresponding to the provider, and query the service list according to the lease agreement number
          let data  = await API.query.resourceOrder.providerAgreements(this.currentAccount.address).then(res => {
            return new Promise(function (resolve,reject){
              resolve(res.toJSON())
            })
          }).then(res => API.query.resourceOrder.rentalAgreements.multi(res)).then(res => {
            return new Promise(function (resolve, reject){
              resolve(res.map(data => data.toJSON()))
            })
          }).catch(() => {
            this.receiveLoading = false
          })
          this.data2 = data;
          this.receiveLoading = false;
        }
      },
      //Obtain user pledge information
      async getStakingInfo() {
        if (this.currentAccount) {
          //ccount address
          let address = this.currentAccount.address;
          //polkaApi
          let API = await api;
          let staking = await API.query.resourceOrder.staking(address);
          if (staking.value.toString()) {
            //Total pledge amount
            this.staking.amount = parseInt(staking.value['amount'].toString());
            //Active amount
            this.staking.activeAmount = parseInt(staking.value['active_amount'].toString());
            //Lock amount
            this.staking.lockAmount = parseInt(staking.value['lock_amount'].toString());
          }
        }
      },
      //Display pledge amount modal
      showStakingModal(params) {
        this.stakingLoading = false;
        //Account address
        if (this.currentAccount) {
          this.visible = true;
          this.stakingAmountTip = false;
          if (params === 'staking') {
            this.title = this.$t("leaseContract.pledgeAmount");
            this.placeholder = this.$t("leaseContract.inputPenaltyAmount");
            this.activeModal = "staking"
          }else {
            this.title = this.$t("leaseContract.withdrawPledgeAmount");
            this.placeholder = this.$t("leaseContract.inputWithdrawPledgeAmount");
            this.activeModal = "withdraw"
          }
        }else {
         this.$message.warning(this.$t("leaseContract.connectWalletTip"))
        }
      },
      ok() {
        if (this.activeModal === 'staking') {
          this.stakingAmountClick()
        }else {
          this.withdrawAmount()
        }
      },
      //Pledge amount
      async stakingAmountClick() {
        //Verify pledge amount
        this.checkStakingAmount();
        if (this.$refs.inputRef.value === "") {
          return;
        }
        let API = await api;
        let address = this.currentAccount.address;
        //Query account balance
        let balanceData = await API.query.system.account(address)
        let price = this.$refs.inputRef.getPrice();
        if (parseInt(balanceData.data.free.toString()) < price) {
          this.$message.warning(this.$t("leaseContract.balance"))
          return
        }
        this.stakingLoading = true;
        //Open plug-in
        await web3Enable("my cool dapp");
        //Get signature
        let signature = await web3FromSource(
            JSON.parse(sessionStorage.getItem("account")).meta.source
        );
        //pledge
        API.tx.resourceOrder.stakingAmount(BigInt(price)).signAndSend(address,{ signer: signature.signer },({status, events, dispatchError}) => {
          if (status.isInBlock) {
            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = API.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                console.log(`${section}.${name}: ${docs.join(' ')}`);
                this.$message.error(this.$t("leaseContract.pledgeFailed") + docs);
                this.stakingLoading = false;
              } else {
                // Other, CannotLookup, BadOrigin, no extra info
                console.log(dispatchError.toString());
                this.$message.error(this.$t("leaseContract.pledgeFailed") + dispatchError.toString());
                this.stakingLoading = false;
              }
            } else {
              this.$message.success(this.$t("leaseContract.pledgeSuccessful"));
              this.stakingLoading = false;
              this.close();
              this.getStakingInfo();
            }
          }
        }).catch(() => {
          this.$message.error(this.$t("leaseContract.pledgeFailed"));
          this.stakingLoading = false;
        })
      },
      async withdrawAmount() {
        //Verify pledge amount
        this.checkStakingAmount();
        if (this.$refs.inputRef.value === "") {
          return;
        }
        let price = this.$refs.inputRef.getPrice();
        //Judge whether the entered pledge amount is less than or equal to the active pledge amount that can be retrieved
        if (price > this.staking.activeAmount) {
          this.$message.warning(this.$t("leaseContract.retrievedAmountBig"));
          return;
        }
        //Withdrawal of pledge amount
        let API = await api;
        let address = this.currentAccount.address;
        this.stakingLoading = true;
        //Open plug-in
        await web3Enable("my cool dapp");
        //Get signature
        let signature = await web3FromSource(
            JSON.parse(sessionStorage.getItem("account")).meta.source
        );
        API.tx.resourceOrder.withdrawAmount(BigInt(price)).signAndSend(address,{ signer: signature.signer },({status, events, dispatchError}) => {
          if (status.isInBlock) {
            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = API.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                console.log(`${section}.${name}: ${docs.join(' ')}`);
                this.$message.error(this.$t("leaseContract.retrievedAmountFailed") + docs);
                this.stakingLoading = false;
              } else {
                // Other, CannotLookup, BadOrigin, no extra info
                console.log(dispatchError.toString());
                this.$message.error(this.$t("leaseContract.retrievedAmountFailed") + dispatchError.toString());
                this.stakingLoading = false;
              }
            } else {
              this.$message.success(this.$t("leaseContract.retrievedAmountSuccess"));
              this.getStakingInfo();
              this.stakingLoading = false;
              this.close();
            }
          }
        }).catch(() => {
          this.$message.error(this.$t("leaseContract.retrievedAmountFailed"));
          this.stakingLoading = false;
        })
      },
      //cancel
      close() {
        this.visible = false;
        this.$refs.inputRef.value = ""
        this.$refs.inputRef.uintPower = 0
      },
      //Only numbers can be entered to verify the pledge amount
      checkStakingAmount() {
        if (this.$refs.inputRef.value === "") {
          this.stakingAmountTip = true;
          return
        }else {
          this.stakingAmountTip = false
        }
        this.$refs.inputRef.value = this.$refs.inputRef.value.replace(/\D/g, "");
      },

      //Receive income
      async receiveIncome(params) {
        //api
        let API = await api;
        //address
        let address = this.currentAccount.address;
        this.receiveLoading= true;
        //Open plug-in
        await web3Enable("my cool dapp");
        //Get signature
        let signature = await web3FromSource(
            JSON.parse(sessionStorage.getItem("account")).meta.source
        );
        API.tx.resourceOrder.withdrawRentalAmount(params.index).signAndSend(address,{ signer: signature.signer },({status, events, dispatchError}) => {
          if (status.isInBlock) {
            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = API.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                console.log(`${section}.${name}: ${docs.join(' ')}`);
                this.$message.error(this.$t("leaseContract.receiveIncomeFailed") + docs);
                this.receiveLoading = false;
              } else {
                // Other, CannotLookup, BadOrigin, no extra info
                console.log(dispatchError.toString());
                this.$message.error(this.$t("leaseContract.receiveIncomeFailed") + dispatchError.toString());
                this.receiveLoading = false;
              }
            } else {
              this.$message.success(this.$t("leaseContract.receiveIncomeSuccess"));
              this.getServiceLists();
              this.receiveLoading = false;
            }
          }
        }).catch(() => {
          this.$message.error(this.$t("leaseContract.receiveIncomeFailed"));
          this.receiveLoading = false;
        })
      },

      //Receive all income
      async receiveAllIncome() {
        let filter = this.data2.filter(item => item.receive_amount > 0);
        if (filter.length === 0) {
          this.$message.warning(this.$t("leaseContract.noIncomeTip"));
          return;
        }
        let txs = [];
        let API = await api;
        filter.forEach(res => {
          let item = API.tx.resourceOrder.withdrawRentalAmount(res.index);
          txs.push(item)
        })
        let address = this.currentAccount.address;
        this.receiveAllLoading = true;
        //Open plug-in
        await web3Enable("my cool dapp");
        //Get signature
        let signature = await web3FromSource(
            JSON.parse(sessionStorage.getItem("account")).meta.source
        );
        API.tx.utility.batch(txs).signAndSend(address,{ signer: signature.signer },({status, events, dispatchError}) => {
          if (status.isInBlock) {
            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = API.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                console.log(`${section}.${name}: ${docs.join(' ')}`);
                this.$message.error(this.$t("leaseContract.allIncomeFailed") + docs);
                this.receiveAllLoading = false;
              } else {
                // Other, CannotLookup, BadOrigin, no extra info
                console.log(dispatchError.toString());
                this.$message.error(this.$t("leaseContract.allIncomeFailed") + dispatchError.toString());
                this.receiveAllLoading = false;
              }
            } else {
              this.$message.success(this.$t("leaseContract.allIncomeSuccess"));
              this.receiveAllLoading = false;
            }
          }
        }).catch(() => {
          this.$message.error(this.$t("leaseContract.allIncomeFailed"));
          this.receiveAllLoading = false;
        })
      },
      //Get current block
      async getCurrentBlock() {
        let API = await api;
        await API.query.system.number((res) => {
          this.currentBlock = res.toString();
        })
      },
    },
    mounted() {
      this.getStakingInfo();
      this.getServiceLists();
      this.getCurrentBlock();
    },
	})

</script>

<style lang="scss" scoped>
.custom-card-spacing {
  margin-top: 16px;
}
.custom-col-action {
  display: flex;
  align-items: center;
}
.service-list-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .receive-btn {
    background-color: rgb(24, 144, 255);
    color: white;
  }
}
.staking-content {
  display: flex;
  align-items: center;
  .title {
    width: 90px;
    color: rgba(0, 0, 0, 0.85);
  }
}
.staking-footer {
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  .staking-btn-close {
    width: 100%;
  }
  .staking-btn-ok {
    background-color: rgb(24, 144, 255);
    color: white;
  }
}
.form-error-tip {
  color: #f5313d;;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 17px;
  margin-left: 80px;
}
</style>
