<template>

	<!-- Main Sidebar -->
	<a-layout-sider
		collapsible
		class="sider-primary"
		breakpoint="lg"
		collapsed-width="0"
		width="250px"
		:collapsed="sidebarCollapsed"
		@collapse="$emit('toggleSidebar', ! sidebarCollapsed)"
		:trigger="null"
		:class="['ant-layout-sider-' + sidebarColor, 'ant-layout-sider-' + sidebarTheme]"
		theme="light"
		:style="{ backgroundColor: 'transparent',}">
			<div class="brand"><img src="images/logo-ct-black.png" alt=""> <span>{{$t("common.sharedComputingPower")}}</span></div>
			<hr>

			<!-- Sidebar Navigation Menu -->
			<a-menu theme="light" mode="inline"
      			:open-keys="openKeys"
				@openChange="onOpenChange"
      >
        <a-sub-menu key="market" style="padding: 0;">
          <span slot="title">
						<span class="icon">
              <a-icon type="shopping" theme="outlined" class="m-0"/>
						</span>
						<span class="label">{{$t("menu.market")}}</span>
					</span>
          <a-menu-item-group>
            <a-menu-item>
              <router-link to="/market/">
                <span class="label">{{$t("menu.computingMarket")}}</span>
              </router-link>
            </a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
        <a-sub-menu key="my-shared" style="padding: 0;">
					<span slot="title">
						<span class="icon">
              <a-icon type="shop" theme="outlined" class="m-0"/>
						</span>
						<span class="label">{{$t("menu.mySharedResources")}}</span>
					</span>
          <a-menu-item-group>
            <a-menu-item>
              <router-link to="/my-shared/shared-resource">
                <span class="label">{{$t("menu.sharedResources")}}</span>
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/my-shared/lease-contract">
                <span class="label">{{$t("menu.leaseContract")}}</span>
              </router-link>
            </a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
        <a-sub-menu key="my" style="padding: 0;">
					<span slot="title">
						<span class="icon">
							<a-icon type="appstore" theme="filled" class="m-0" />
						</span>
						<span class="label">{{$t("menu.myUsageResources")}}</span>
					</span>
          <a-menu-item-group>
            <a-menu-item>
              <router-link to="/my/service-list">
                <span class="label">{{$t("menu.serviceList")}}</span>
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/my/order-list">
                <span class="label">{{$t("menu.orderList")}}</span>
              </router-link>
            </a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
			</a-menu>

	</a-layout-sider>
	<!-- / Main Sidebar -->

</template>

<script>

	export default ({
		props: {
			// Sidebar collapsed status.
			sidebarCollapsed: {
				type: Boolean,
				default: false,
			},

			// Main sidebar color.
			sidebarColor: {
				type: String,
				default: "primary",
			},

			// Main sidebar theme : light, white, dark.
			sidebarTheme: {
				type: String,
				default: "light",
			},
		},
		data() {
			return {
        rootSubmenuKeys: ['market', 'my-shared', 'my', 'dashboards', 'pages', 'applications', 'ecommerce', 'authentication', 'basic', 'components', 'changelog'],
				openKeys: this.$route.meta.sidebarMap,
			}
		},
		methods: {
			onOpenChange(openKeys) {
				const latestOpenKey = openKeys.find( key =>  this.openKeys.indexOf( key ) === -1 )
        if ( this.rootSubmenuKeys.indexOf( latestOpenKey ) === -1 ) {
					this.openKeys = openKeys;
				} else {
					this.openKeys = latestOpenKey ? [ latestOpenKey ] : [] ;
				}
			},
		},
	})

</script>
