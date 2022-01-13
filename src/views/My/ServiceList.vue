
<template>
	<div>
    <a-spin :spinning="allLoading">
      <div class="pricing-wrapper">
        <div class="container">
          <a-empty v-if="resources.length === 0" />
          <a-row v-else type="flex" :gutter="[24,24]">
            <a-col :span="24" :lg="6" v-for="item in resources" v-bind:key="item.index" >
              <!-- Pricing card -->
              <a-card class="card-pricing header-solid" :bodyStyle="{padding: '20px'}">
                <div>
                  <a-descriptions class="list-pricing" :title="$t('serviceList.resourceID') + item.index" :column="1">
                    <a-descriptions-item :label="$t('serviceList.creationTime')">
                      {{ item.createTime }}
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('serviceList.endTime')">
                      {{ item.endTime }}
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('serviceList.resourceStatus')">
                      {{ item.status === "Using" ? $t("serviceList.inuse") : item.status === "Punished" ? $t("serviceList.punished") : $t("serviceList.completed") }}
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('serviceList.cpuModel')">
                      {{ item.config.cpu_model.substr(0,34) + '...' }}
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('serviceList.cpu')">
                      {{ item.config.cpu }}
                    </a-descriptions-item>
                    <a-descriptions-item :label="$t('serviceList.memory')">
                      {{ item.config.memory }}
                    </a-descriptions-item>
                  </a-descriptions>
                </div>
                <a-button type="primary" @click="ok(item)" block style="margin-top: 16px" :disabled="item.status === 'Using' ? false : item.status === 'Punished' && item.penalty_amount != '0' ? false : true">
                  {{getStatus(item)}}
                </a-button>
              </a-card>
              <!-- / Pricing card -->
            </a-col>
          </a-row>
        </div>
      </div>
    </a-spin>
    <a-modal v-model="visible" :title="$t('serviceList.renew')" :maskClosable="false" :footer="null" :centered="true" :closable="false">
      <a-spin :spinning="renewLoading">
        <div class="staking-content">
          <span class="title">{{$t("serviceList.renewalDuration")}}</span>
          <a-input :laceholder="$t('serviceList.inputRenewalAmount')" v-model="renewAmount" @change="checkRenewAmount" :placeholder="$t('serviceList.inputRenewalDuration')"/>
        </div>
        <span class="form-error-tip" v-if="renewAmountTip">{{$t("serviceList.amountNotBlank")}}</span>
        <div class="staking-footer">
          <a-button class="staking-btn-close" @click="close">{{$t("common.cancel")}}</a-button>
          <a-button class="staking-btn-ok" @click="renew">{{$t("common.determine")}}</a-button>
        </div>
      </a-spin>
    </a-modal>
	</div>
</template>

<script>
import api from "../../api/index";
import { mapGetters } from "vuex";
import {timeToDay} from "../../utils/common"
import {web3Enable, web3FromSource} from "@polkadot/extension-dapp";
import {message} from "ant-design-vue";
	export default ({
		data() {
			return {
        visible: false,
        allLoading: false,
        renewLoading: false,
        renewAmount: "",
        renewIndex: "",
        renewAmountTip: false,
        resources:[],
        showOrderCreateModal:false,
        resource:{
          rental_info:{},
          rental_statistics:{},
          config:{}
        }
			}
		},
    mounted() {
      this.getResourceList();
    },
    computed: {
      ...mapGetters("account", ["currentAccount"]),
      getStatus() {
        return function (params) {
          if (params.status === "Using") {
            return this.$t("serviceList.renew")
          }else if (params.status === "Punished" && params.penalty_amount != "0") {
            return  this.$t("serviceList.receivePenaltyAmount")
          }else if (params.status === "Punished" && params.penalty_amount === "0") {
            return this.$t("serviceList.penaltyAmountReceived")
          }else {
            return this.$t("serviceList.completed")
          }
        }
      }
    },
    methods: {
      //cancel
      close() {
        this.visible = false;
        this.renewAmount = "";
        this.renewIndex = ""
      },
      //Only numbers can be entered to verify the renewal amount
      checkRenewAmount() {
        if (this.renewAmount === "") {
          this.renewAmountTip = true;
          return
        }else {
          this.renewAmountTip = false
        }
        this.renewAmount = this.renewAmount.replace(/\D/g, "");
      },
      //Get my services list
      async getResourceList() {
        if (this.currentAccount) {
          let data = await api.then(t => t.query.resourceOrder.userAgreements(this.currentAccount.address)).then(data => {
            return new Promise(function(resolve, reject){
              resolve(data.toJSON())
            })
          }).then(data => api.then(t => t.query.resourceOrder.rentalAgreements.multi(data))).then(data => {
            return new Promise(function(resolve, reject){
              resolve(data.map(t => t.toHuman()))
            })
          });
          let list = [];
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              data[i]['createTime'] = await this.getStartTime(data[i].start);
              data[i]['endTime'] = await this.getDeadline(data[i].end);
              list.push(data[i])
            }
          }
          this.resources = list;
        }
      },
      async ok(params) {
        if (params.status === "Using") {
          //Renewal in use
          this.showStakingModal(params.index);
        }else {
          //Receive penalty amount
          this.receivePenaltyAmount(params.index)
        }
      },
      showStakingModal(index) {
        this.visible = true;
        this.renewIndex = index;
      },
      //renew
      async renew() {
        //Verify pledge amount
        this.checkRenewAmount();
        if (this.renewAmount === "") {
          return;
        }
        let API = await api;
        this.renewLoading = true;
        //Open plug-in
        await web3Enable("my cool dapp");
        //Get signature
        let signature = await web3FromSource(
            this.currentAccount.meta.source
        );
        //Agreement renewal
        API.tx.resourceOrder.renewAgreement(this.renewIndex,this.renewAmount).signAndSend(this.currentAccount.address,{ signer: signature.signer },({status, events, dispatchError}) => {
          if (status.isInBlock) {
            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = API.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                console.log(`${section}.${name}: ${docs.join(' ')}`);
                this.$message.error(this.$t("serviceList.renewalFailed") + docs);
                this.renewLoading = false;
              } else {
                // Other, CannotLookup, BadOrigin, no extra info
                console.log(dispatchError.toString());
                this.$message.error(this.$t("serviceList.renewalFailed") + dispatchError.toString());
                this.renewLoading = false;
              }
            } else {
              this.$message.success(this.$t("serviceList.renewalSucceeded"));
              this.renewLoading = false;
              this.close();
              this.getResourceList();
            }
          }
        }).catch(() => {
          this.$message.error(this.$t("serviceList.renewalFailed"));
          this.renewLoading = false;
        })
      },
      //cancellation of order
      async cancelOrder(index) {
        this.allLoading = true;
        let API = await api;
        //Open plug-in
        await web3Enable("my cool dapp");
        //Get signature
        let signature = await web3FromSource(
            this.currentAccount.meta.source
        );
        API.tx.resourceOrder.cancelOrder(index).signAndSend(this.currentAccount.address,{signer:signature.signer},({status, events, dispatchError}) => {
          if (status.isInBlock) {
            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = API.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                console.log(`${section}.${name}: ${docs.join(' ')}`);
                this.$message.error(this.$t("serviceList.orderCancellationFailed") + docs);
                this.allLoading = false;
              } else {
                // Other, CannotLookup, BadOrigin, no extra info
                console.log(dispatchError.toString());
                this.$message.error(this.$t("serviceList.orderCancellationFailed") + dispatchError.toString());
                this.allLoading = false;
              }
            } else {
              this.$message.success(this.$t("serviceList.orderCancelledSuccessfully"));
              this.allLoading = false;
              this.getResourceList();
            }
          }
        }).catch(() => {
          this.$message.error(this.$t("serviceList.orderCancellationFailed"));
          this.allLoading = false;
        })
      },
      //Receive penalty amount
      async receivePenaltyAmount(index) {
        this.allLoading = true;
        let API = await api;
        //Open plug-in
        await web3Enable("my cool dapp");
        //Get signature
        let signature = await web3FromSource(
            this.currentAccount.meta.source
        );
        //Claim amount
        API.tx.resourceOrder.withdrawFaultExcution(index).signAndSend(this.currentAccount.address,{signer:signature.signer},({ status, events, dispatchError }) => {
          if (status.isInBlock) {
            if (dispatchError) {
              if (dispatchError.isModule) {
                // for module errors, we have the section indexed, lookup
                const decoded = API.registry.findMetaError(dispatchError.asModule);
                const { docs, name, section } = decoded;
                this.$message.error(this.$t("serviceList.collectionFailed") + docs);
                this.allLoading = false;
              } else {
                // Other, CannotLookup, BadOrigin, no extra info
                message.error(this.$t("serviceList.collectionFailed") + ":" + dispatchError.toString());
                this.allLoading = false
              }
            } else {
              this.$message.success(this.$t("serviceList.receivedSuccessfully"));
              this.allLoading = false;
              this.getResourceList();
            }
          }
        }).catch(()=> {
          this.$message.error(this.$t("serviceList.collectionFailed"));
          this.allLoading = false;
        })
      },
      // deadline
      async getDeadline(params) {
        let apiPro = await api;
        let header = await apiPro.rpc.chain.getHeader();
        let space = parseInt(params.replace(",","")) - parseInt(header.number.toNumber());
        let now = new Date();
        return timeToDay(
            now.getTime() + space * 6 * 1000
        );
      },
      //start time
      async getStartTime(params) {
        let now = new Date();
        let apiPro = await api;
        let header = await apiPro.rpc.chain.getHeader();
        let space = parseInt(header.number.toNumber()) - parseInt(params.replace(",",""));
        return timeToDay(
            now.getTime() - space * 6 * 1000
        );
      }
		},
	})

</script>

<style lang="scss" scoped>
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
