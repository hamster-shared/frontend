<template>

	<!-- Main Sidebar -->
	<component :is="navbarFixed ? 'a-affix' : 'div'" :offset-top="top">

		<!-- Layout Header -->
		<a-layout-header>
			<a-row type="flex">

				<!-- Header Breadcrumbs & Title Column -->
				<a-col :span="20" :md="6">

					<!-- Header Breadcrumbs -->
					<a-breadcrumb>
						<template v-for="(item, key) in $route.meta.breadcrumbs">
							<a-breadcrumb-item v-if="key == $route.meta.breadcrumbs.length - 1" :key="key">{{ $t(item) }}</a-breadcrumb-item>
							<a-breadcrumb-item v-else :key="key"><router-link to="/market/">{{ $t(item) }}</router-link></a-breadcrumb-item>
						</template>
					</a-breadcrumb>
					<!-- / Header Breadcrumbs -->

					<!-- Header Page Title -->
					<div class="ant-page-header-heading">
						<span class="ant-page-header-heading-title">{{ $t('menu.'+ this.$route.meta.title) || $t('menu.' + this.$route.name) }}</span>
					</div>
					<!-- / Header Page Title -->

				</a-col>
				<!-- / Header Breadcrumbs & Title Column -->

				<!-- Header Breadcrumbs & Title Column -->
				<a-col :span="4" :md="1" class="sidebar-toggler-col">

					<!-- / Header Page Title -->
					<a-button type="link" class="sidebar-toggler" @click="$emit('minimizeSidebar') , resizeEventHandler()">
						<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/></svg>
					</a-button>

				</a-col>
				<!-- / Header Breadcrumbs & Title Column -->

				<!-- Header Control Column -->
				<a-col :span="24" :md="17" class="header-control">
					<a-button type="link" class="sidebar-toggler" @click="$emit('toggleSidebar', ! sidebarCollapsed) , resizeEventHandler()">
						<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/></svg>
					</a-button>
					<a class="btn-sign-in">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z" fill="#111827"/>
						</svg>
						<div class="d-inline" v-if="currentAccount" @click="queryAccount">
              <a-dropdown :trigger="['click']" overlayClassName="header-notifications-dropdown" :getPopupContainer="() => wrapper">
                <span>{{ currentAccount.address }}</span>
                <a-list item-layout="horizontal" class="header-notifications-list" :data-source="accountList" slot="overlay">
                  <a-list-item slot="renderItem" slot-scope="item">
                    <a-list-item-meta>
                      <a slot="title" @click="selectAccount(item)">{{ item.address }}</a>
                    </a-list-item-meta>
                  </a-list-item>
                </a-list>
              </a-dropdown>
            </div>
            <div class="d-inline"  @click="connPolkadot()" v-else><span>{{$t("common.linkWallet")}}</span></div>
            <a-select :default-value="defaultValue" style="width: 120px" @change="handleChange" v-if="false">
              <a-select-option value="enUS">
                English
              </a-select-option>
              <a-select-option value="zhCN">
                中文/简体
              </a-select-option>
            </a-select>
					</a>
				</a-col>
			</a-row>
		</a-layout-header>
	</component>

</template>

<script>
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import { message } from "ant-design-vue";
import { mapGetters,mapMutations } from "vuex";
	export default ({
		props: {
			// Header fixed status.
			navbarFixed: {
				type: Boolean,
				default: false,
			},

			// Sidebar collapsed status.
			sidebarCollapsed: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
        defaultValue: sessionStorage.getItem("lang") === "en" ? "enUS" : "zhCN",
				// Fixed header/sidebar-footer ( Affix component ) top offset.
				top: 0,
				// Search input loading status.
				searchLoading: false,
				// The wrapper element to attach dropdowns to.
				wrapper: document.body,
			}
		},
		methods: {
      handleChange(val) {
        this.$store.dispatch('lang/changeLang', val)
      },
			resizeEventHandler(){
				this.top = this.top ? 0 : -0.01 ;
				// To refresh the header if the window size changes.
				// Reason for the negative value is that it doesn't activate the affix unless
				// scroller is anywhere but the top of the page.
			},
			onSearch(value){
			},
      async connPolkadot() {
        const extensions = await web3Enable("my cool dapp");
        console.log(extensions);
        if (extensions.length === 0) {
          message.warning(this.$t("common.linkWalletTip"));
          return;
        }
        const allAccounts = await web3Accounts();
        if (allAccounts.length === 0) {
          message.warning(this.$t("common.noAccount"));
          return;
        }
        sessionStorage.setItem("account", JSON.stringify(allAccounts[0]));
        sessionStorage.setItem("allAccounts", JSON.stringify(allAccounts));
        this.initAccount()
      },
      //选择账户
      selectAccount(account){
        sessionStorage.setItem("account", JSON.stringify(account));
        this.setCurrent(account)
      },
      ...mapMutations('account',["setAccounts","setCurrent"]),
      //初始化账户
      initAccount() {
        const allAccounts = sessionStorage.getItem("allAccounts");
        if (allAccounts) {
          this.setAccounts(JSON.parse(allAccounts))
        }
        const account = sessionStorage.getItem("account");
        if (account) {
          this.setCurrent(JSON.parse(account))
        }
      },
      //查询刷新账户
      async queryAccount() {
        const extensions = await web3Enable("my cool dapp");
          if (extensions.length === 0) {
          message.warning(this.$t("common.linkWalletTip"));
          this.setCurrent(null);
          sessionStorage.removeItem("account");
          sessionStorage.removeItem("account");
          return;
        }
        const allAccounts = await web3Accounts();
        if (allAccounts.length != 0) {
          this.setAccounts(allAccounts);
          this.setCurrent(allAccounts[0])
        }else {
          this.setCurrent(null)
        }
      }
		},
		mounted: function(){
      if (sessionStorage.getItem("lang")) {
        if (sessionStorage.getItem("lang") === "en")   {
          this.handleChange("enUS")
        }else {
          this.handleChange("zhCN")
        }
      }
      // Set the wrapper to the proper element, layout wrapper.
			this.wrapper = document.getElementById('layout-dashboard') ;
		},
		created() {
			// Registering window resize event listener to fix affix elements size
			// error while resizing.
			window.addEventListener("resize", this.resizeEventHandler);
      this.initAccount();
		},
		destroyed() {
			// Removing window resize event listener.
			window.removeEventListener("resize", this.resizeEventHandler);
		},
    computed: {
      ...mapGetters("account", ["accountList", "currentAccount"]),
    }
	})

</script>
