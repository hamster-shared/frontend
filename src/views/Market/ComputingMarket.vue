
<template>
		<div class="market-wrapper">
      <a-row type="flex" :gutter="[24,24]">
        <a-col :span="24" :lg="12" :xl="5"  :xxl="4" v-for="(sort, index) in sorts" :key="index" >
          <a-card style="cursor: pointer;font-size: 25px;user-select:none;" @click="changeOrder(index)" class="widget-1 mb-20" :bordered="false">
              <a-icon v-if="sort.order===1" class="text-success" type="up-circle" />
              <a-icon v-else-if="sort.order===2" class="text-success" type="down-circle" />
              <a-icon v-else class="text-success" type="minus-circle" />
              <span class="ml-10">{{sort.value}}</span>
          </a-card>
        </a-col>
      </a-row>

			<!-- Main Container -->
			<div class="container">
        <a-empty v-if="resourcesSort.length === 0" />
				<a-row v-else type="flex" :gutter="[24,24]">
					<a-col :span="24" :lg="6" v-for="item in resourcesSort" v-bind:key="item.index" >
						<!-- Pricing card -->
						<a-card class="card-pricing header-solid" :bodyStyle="{padding: '20px'}">
							<a-tag class="bg-gray-4 text-gray-9 font-bold">
								{{$t('market.priceInfo')}}
							</a-tag>
							<h1 class="font-semibold">
								<small>{{ item.rent_unit_price }}</small>
							</h1>
              <a-descriptions class="list-pricing mb-5" :title="$t('market.calculateResourceNumber') + ': ' + item.index" :column="1">
                <a-descriptions-item :label="$t('market.system')">
                  {{ item.system }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('market.cpuModel')">
                  {{ item.cpu_model.substr(0,30) + '...' }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('market.cpu')">
                  {{ item.cpu }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('market.memory')">
                  {{ item.memory }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('market.provider')">
                  {{ item.account_id.substr(0,30) + '...' }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('market.rentalDuration')">
                  {{ item.rent_duration }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('market.numberFailures')">
                  {{ item.fault_count }}
                </a-descriptions-item>
                <a-descriptions-item :label="$t('market.numberServices')">
                  {{ item.rental_count }}
                </a-descriptions-item>
              </a-descriptions>

							<a-button class="mb-5" type="primary" @click="openOrderCreate(item)" block>
								{{$t('market.purchase')}}
							</a-button>
						</a-card>
						<!-- / Pricing card -->
					</a-col>
				</a-row>
			</div>
			<!-- / Main Container -->
      <a-modal v-model="showOrderCreateModal" :width="700" :footer="null" :forceRender="true" :title="$t('market.createOrder')" on-ok="showOrderCreateModal = false" @cancel="() => this.loading = false">
          <!-- Order Details card -->
          <a-card :bordered="false" class="card-order header-solid mb-24 mx-auto" :bodyStyle="{paddingTop: 0}" style="max-width: 800px;">

            <!-- Order Products row -->
            <a-row :gutter="[24]" type="flex" class="order-products" align="top">
              <a-col :span="24" :md="6">
                <div class="d-flex">
                  <div>
                    <h6 class="mb-0 font-semibold">{{ $t("market.calculateResourceNumber") }}</h6>
                    <p class="mb-5"># {{ resource.index }}</p>
                    <a-tag class="ant-tag-success font-semibold">{{ resource.rent_unit_price }}</a-tag>
                  </div>
                </div>
              </a-col>
              <a-col :span="24" :md="18" class="ml-auto">
                <h6 class="mb-15">{{ $t('market.rentedDuration') }}</h6>
                <a-input oninput="value=value.replace(/[^\d]/g,'');if(value>=4294967295)value=4294967295"  class="mb-15" v-model="param.rentalHour"
                         :placeholder="$t('market.inputLeaseDuration')">
                  <a-icon slot="prefix" type="clock-circle"/>
                </a-input>
                <h6 class="mb-10">{{ $t("market.userPublicKey") }}</h6>
                <a-textarea v-model="param.publicKey" :rows="4"
                            :placeholder="$t('market.inputUserPublic')">
                </a-textarea>
              </a-col>
            </a-row>
            <!-- / Order Products row -->

            <hr class="gradient-line">

            <a-row :gutter="[24]" type="flex">

              <!-- Payment and billing info -->
              <a-col :span="24" :lg="14">

                <!-- Payment Details -->
                <h6 class="mb-15">{{ $t("market.buyingInformation") }}</h6>
                <a-card class="payment-method-card mb-24">
                  <h6 class="card-number">{{ showAddress }}</h6>
                </a-card>
                <!-- / Payment Details -->

                <!-- Billing Information -->
                <h6 class="mb-15">{{ $t("market.calculateResourceInformation") }}</h6>
                <a-card :bordered="false" class="card-billing-info">
                  <div class="col-info">
                    <a-descriptions title="" :column="1">
                      <a-descriptions-item :label="$t('market.system')">
                        {{ resource.system }}
                      </a-descriptions-item>
                      <a-descriptions-item :label="$t('market.cpuModel')">
                        {{ resource.cpu_model }}
                      </a-descriptions-item>
                      <a-descriptions-item :label="$t('market.cpu')">
                        {{ resource.cpu }}
                      </a-descriptions-item>
                      <a-descriptions-item :label="$t('market.memory')">
                        {{ resource.memory }}
                      </a-descriptions-item>
                    </a-descriptions>
                  </div>
                </a-card>
                <!-- / Billing Information -->

              </a-col>
              <!-- / Payment and billing info -->

              <!-- Order Summary -->
              <a-col :span="24" :lg="8" class="ml-auto">
                <h6 class="mb-15">{{ $t("market.paymentDetails") }}</h6>
                <div class="d-flex mb-10">
                  <span class="text-muted">
                    {{ $t("market.rentalPrice") + ":" }}
                  </span>
                  <span class="text-lg text-dark font-semibold ml-auto">
                    {{ showPrice }}
                  </span>
                </div>
                <div class="d-flex mb-30">
                  <span class="text-muted">
                   {{ $t("market.serviceCharge") + ":" }}
                  </span>
                  <span class="text-lg text-dark font-semibold ml-auto">
                    {{ showFee }}
                  </span>
                </div>
                <div class="d-flex mb-50">
                  <h5 class="font-regular text-muted">
                    {{ $t("market.totalPrice") + ":" }}
                  </h5>
                  <h5 class="text-dark font-semibold ml-auto">
                    {{ showTotal }}
                  </h5>
                </div>
                <div class="d-flex">
                  <a-button type="primary" @click="createOrder()" :loading="loading" block>
                    {{ $t("market.purchase")}}
                  </a-button>
                </div>
              </a-col>
              <!-- / Order Summary -->

            </a-row>

          </a-card>
          <!-- / Order Details card -->
        </a-modal>
		</div>
</template>

<script>
import { mapGetters } from "vuex";
import { web3FromSource, web3Enable } from "@polkadot/extension-dapp";
import {message} from "ant-design-vue";
	export default ({
		data() {
			return {
        resources: [],
        showOrderCreateModal: false,
        resource: {
          rental_info: {},
          rental_statistics: {},
          config: {}
        },
        param:{
          rentalHour: "",
          publicKey: "",
        },
        showFee: "",
        price: 0n,
        fee: 0n,
        loading: false,
        resourcesSort:[]
      }
		},
    mounted() {
      this.queryResourceList()
    },
    methods: {
      newResource(index,rent_unit_price,unit_price,system,cpu_model,cpu,memory,
                  account_id,rent_duration,fault_count,rental_count){
        let duration = rent_duration.replace(",","")
        return {index,rent_unit_price,unit_price,system,cpu_model,cpu,memory,
          account_id,rent_duration,duration,fault_count,rental_count}
      },
      changeOrder(index){
        let oldOrder = this.sorts[index].order;
        this.sorts.forEach(t => t.order = 0)
        let newOrder = this.addOrder(oldOrder);
        this.sorts[index].order = newOrder
        this.sort(index,newOrder)
      },
      addOrder(order){
        let i = order + 1;
        if(i > 2){
          return 0
        }
        return i
      },
      sort(index,order){
        if(order){
          this.resourcesSort.sort((a1,a2) => {
            return order===1
                ?Number(a1[this.sorts[index].key] - a2[[this.sorts[index].key]])
                :Number(a2[this.sorts[index].key] - a1[[this.sorts[index].key]])
          })

        }else{
          this.resourcesSort = Object.assign([],this.resources)
        }
      },
      queryResourceList(){
        this.api.query.provider.resources.entries()
            .then(data => {
              let list = []
              data.forEach(([k,v]) => {
                let resource = v.toHuman();
                if(resource.status === "Unused"){
                  let unit_price = v.value.rental_info.rent_unit_price.toBigInt();
                  let item = this.newResource(resource.index,resource.rental_info.rent_unit_price,unit_price,resource.config.system
                      ,resource.config.cpu_model,resource.config.cpu,resource.config.memory,resource.account_id
                      ,resource.rental_info.rent_duration,resource.rental_statistics.fault_count
                      ,resource.rental_statistics.rental_count)
                  list.push(item)
                }
              })
              this.resources = Object.assign([],list)
              this.resourcesSort = list;
            })
      },
      openOrderCreate(item){
        this.resource = item
        this.param = {
          rentalHour:"",
          publicKey:"",
        }
        this.showOrderCreateModal = true
      },
      closeOrderCreate(){
        this.resource = {}
        this.param = {
          rentalHour:"",
          publicKey:"",
        }
        this.showOrderCreateModal = false
      },
      createOrder(){
        if(!this.currentAccount){
          message.error(this.$t("market.noUsers"));
          return
        }
        if(!this.param.rentalHour){
          message.error(this.$t("market.inputRentalDurationTIp"));
          return
        }
        if(!this.param.publicKey){
          message.error(this.$t("market.inputPubilcKeyTip"));
          return
        }
        this.loading = true;
        web3Enable("my cool dapp")
        web3FromSource(this.currentAccount.meta.source)
            .then( signature =>
                this.api.tx.resourceOrder.createOrderInfo(
                    this.resource.index,
                    this.param.rentalHour,
                    this.param.publicKey)
                    .signAndSend(
                        this.currentAccount.address,
                        { signer: signature.signer },
                        ({ status, events, dispatchError }) => {
                          if (status.isInBlock) {
                            if (dispatchError) {
                              if (dispatchError.isModule) {
                                // for module errors, we have the section indexed, lookup
                                const decoded = this.api.registry.findMetaError(dispatchError.asModule);
                                const { docs, name, section } = decoded;
                                console.log(`${section}.${name}: ${docs.join(' ')}`);
                                message.error(this.$t("market.orderPaymentFailed") + docs);
                                this.loading = false
                              } else {
                                // Other, CannotLookup, BadOrigin, no extra info
                                console.log(dispatchError.toString());
                                message.error(this.$t("market.orderPaymentFailed") + dispatchError.toString());
                                this.loading = false
                              }
                            } else {
                              message.success(this.$t("market.orderPaymentＳucceeded"));
                              this.loading = false
                              this.closeOrderCreate()
                              this.queryResourceList()
                            }
                          }
                        })
                    .catch((err) => {
                      this.loading = false
                      message.error(this.$t("market.orderPaymentFailed") + err)
                    })
            ).catch((err) => {
              this.saveDataLoading = false;
              message.error(this.$t("market.balance")+ err);
            })
      },
      getFee(){
        if (this.currentAccount) {
          if (this.param.rentalHour <= 4294967295 ) {
            this.api.tx.resourceOrder.createOrderInfo(
                this.resource.index,
                this.param.rentalHour,
                this.param.publicKey).paymentInfo(this.currentAccount.address)
                .then((res) => {
                  this.fee = res.partialFee.toBigInt()
                  this.showFee = res.partialFee.toHuman()
                })
          } else {
            this.showFee = "0 Unit"
          }
        }
      }
		},
    computed:{
      sorts() {
        return [
          {
            value: this.$t("market.price"),
            order: 0,
            key:"unit_price"
          },
          {
            value: this.$t("market.cpu"),
            order: 0,
            key:"cpu"
          },
          {
            value: this.$t("market.memory"),
            order: 0,
            key:"memory"
          },
          {
            value: this.$t("market.leaseTerm"),
            order: 0,
            key:"duration"
          },
        ]
      },
      showPrice(){
        let n = Number(this.param.rentalHour);
        if(!isNaN(n) && this.resource.unit_price){
          this.price = this.resource.unit_price * BigInt(this.param.rentalHour)
          return this.api.registry.createType('Balance', this.price).toHuman()
        }
        return "0 Unit"
      },
      showTotal(){
        let total = this.price + this.fee;
        return this.api.registry.createType('Balance', total).toHuman()
      },
      showAddress(){
        if (this.currentAccount){
          let address = this.currentAccount.address
          return address.substring(0,12) + '******' + address.substring(40)
        }else{
          return ""
        }
      },
      ...mapGetters("account", ["currentAccount"]),
      ...mapGetters("polkadot", ["api"]),
    },
    watch:{
      param: {
        handler(newVal, oldVal) {
          let n = Number(newVal.rentalHour);
          if(!isNaN(n)){
            this.getFee()
          }
        },
        immediate: true,
        deep: true
      }
    }
	})

</script>

<style lang="scss" scoped>

</style>
