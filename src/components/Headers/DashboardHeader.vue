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
	const notificationsData = [
		/*{
			title: 'New message from Sophie',
			img: 'images/face-1.jpg',
			time: '13 minutes ago',
		},
		{
			title: 'New album by Travis Scott',
			svg: `<svg width="20" height="20" viewBox="0 0 107 107" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					<title>logo-spotify</title>
					<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						<g id="logo-spotify" fill="#2EBD59" fill-rule="nonzero">
							<path d="M53.5,0 C23.9517912,0 0,23.9517912 0,53.5 C0,83.0482088 23.9517912,107 53.5,107 C83.0482088,107 107,83.0482088 107,53.5 C107,23.9554418 83.0482088,0.00365063118 53.5,0 Z M78.0358922,77.1597407 C77.0757762,78.7368134 75.0204708,79.2296486 73.4506994,78.2695326 C60.8888775,70.5922552 45.0743432,68.8582054 26.4524736,73.1111907 C24.656363,73.523712 22.8675537,72.3993176 22.458683,70.6032071 C22.0461617,68.8070966 23.1669055,67.0182873 24.9666667,66.6094166 C45.3444899,61.9548618 62.8273627,63.9590583 76.9297509,72.5745479 C78.4995223,73.5419652 78.9996588,75.5899693 78.0358922,77.1597407 L78.0358922,77.1597407 Z M84.5814739,62.5973729 C83.373115,64.5614125 80.8030706,65.1747185 78.8426817,63.9700102 C64.4664961,55.1318321 42.5408052,52.5727397 25.5325145,57.7347322 C23.3275333,58.4027977 20.9984306,57.1579324 20.3267144,54.9566018 C19.6622996,52.7516206 20.9071648,50.4261685 23.1084954,49.7544524 C42.5371546,43.858683 66.6933811,46.7134766 83.2051859,56.8622313 C85.1692255,58.0705902 85.7898328,60.636984 84.5814739,62.5973729 Z M85.1436711,47.4253497 C67.8980894,37.1853292 39.4523712,36.2434664 22.9880246,41.2375299 C20.3449676,42.0406687 17.5485841,40.5475606 16.7490959,37.9045036 C15.9496076,35.2614466 17.4390652,32.4650631 20.0857728,31.6619243 C38.9850904,25.9267827 70.3987718,27.0329239 90.2509041,38.8171614 C92.627465,40.2299556 93.4087001,43.3001365 91.9995565,45.6730467 C90.5940635,48.0532583 87.5165814,48.838144 85.1436711,47.4253497 Z" id="Shape"></path>
						</g>
					</g>
				</svg>`,
			time: '1 day ago',
		},
		{
			title: 'Payment completed',
			svg: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path fill="#1890FF" d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z"/>
					<path fill="#1890FF" fill-rule="evenodd" clip-rule="evenodd" d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z"/>
				</svg>`,
			time: '2 days ago',
		},*/
	] ;

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

			// Header notifications data.
			notificationsData: {
				type: Array,
				default: () => notificationsData,
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
