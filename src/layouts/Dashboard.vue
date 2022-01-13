
<template>
  <a-config-provider :locale="locale">
    <div>

      <!-- Dashboard Layout -->
      <a-layout class="layout-dashboard" id="layout-dashboard" :class="[navbarFixed ? 'navbar-fixed' : '', ! sidebarCollapsed ? 'has-sidebar' : '', layoutClass, sidebarMinimized ? 'sidebar-minimized' : '' ]">

        <!-- Main Sidebar -->
        <DashboardSidebar
            :sidebarCollapsed="sidebarCollapsed"
            :sidebarColor="sidebarColor"
            :sidebarTheme="sidebarTheme"
            @toggleSidebar="toggleSidebar"
        ></DashboardSidebar>
        <!-- / Main Sidebar -->

        <!-- Layout Content -->
        <a-layout>

          <!-- Layout Header's Conditionally Fixed Wrapper -->
          <DashboardHeader
              :sidebarCollapsed="sidebarCollapsed"
              :navbarFixed="navbarFixed"
              @toggleSettingsDrawer="toggleSettingsDrawer"
              @toggleSidebar="toggleSidebar"
              @minimizeSidebar="minimizeSidebar"
          ></DashboardHeader>
          <!-- / Layout Header's Conditionally Fixed Wrapper -->

          <!-- Page Content -->
          <a-layout-content>
            <router-view :navbarFixed="navbarFixed" />
          </a-layout-content>
          <!-- / Page Content -->

          <!-- Sidebar Overlay -->
          <div class="sidebar-overlay" @click="sidebarCollapsed = true" v-show="! sidebarCollapsed"></div>
          <!-- / Sidebar Overlay -->
        </a-layout>
      </a-layout>
      <!-- / Dashboard Layout -->

    </div>
  </a-config-provider>
</template>

<script>
import moment from 'moment';
import 'moment/locale/zh-cn';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import DashboardSidebar from '../components/Sidebars/DashboardSidebar' ;
import DashboardHeader from '../components/Headers/DashboardHeader' ;
import DashboardFooter from '../components/Footers/DashboardFooter' ;
import DashboardSettingsDrawer from '../components/Sidebars/DashboardSettingsDrawer' ;

const EN = 'en-us'
const ZH = 'zh-cn'

	export default ({
		components: {
			DashboardSidebar,
			DashboardHeader,
			DashboardFooter,
			DashboardSettingsDrawer,
		},
		data() {
			return {
        locale: this.$store.state.lang.lang,
				// Sidebar collapsed status.
				sidebarCollapsed: false,

				// Sidebar minimized status.
				sidebarMinimized: false,

				// Main sidebar color.
				sidebarColor: "primary",

				// Main sidebar theme : light, white, dark.
				sidebarTheme: "light",

				// Header fixed status.
				navbarFixed: false,

				// Settings drawer visiblility status.
				showSettingsDrawer: false,

			}
		},
    created() {
      moment.locale('en')
      this.$i18n.locale = EN
      sessionStorage.lang === undefined ? sessionStorage.setItem("lang","en") : ""
    },
    methods: {

			// Toggle sidebar's collapsed status.
			toggleSidebar( value ) {
				this.sidebarCollapsed = value ;
			},

			// Toggle sidebar's minimized status.
			minimizeSidebar( value ) {
				this.sidebarMinimized = ! this.sidebarMinimized ;
			},

			// Toggle ettings drawer's visiblility status.
			toggleSettingsDrawer( value ) {
				this.showSettingsDrawer = value ;
			},

			// Toggle navbar's fixed status.
			toggleNavbarPosition( value ) {
				this.navbarFixed = value ;
			},

			// Change sidebar's theme.
			updateSidebarTheme( value ) {
				this.sidebarTheme = value ;
			},

			// Change sidebar's color.
			updateSidebarColor( value ) {
				this.sidebarColor = value ;
			},

		},
		computed: {
			// Sets layout's element's class based on route's meta data.
			layoutClass() {
				return this.$route.meta.layoutClass ;
			},
      getLang() {
        return this.$store.state.lang.lang
      }
		},
    watch: {
      getLang(val) {
        if (val === 'enUS') {
          this.locale = enUS;
          moment.locale('en')
          this.$i18n.locale = EN
          sessionStorage.setItem("lang","en")
        } else {
          this.locale = zhCN;
          moment.locale('zh-cn')
          this.$i18n.locale = ZH
          sessionStorage.setItem("lang","zh-cn")
        }
      }
    }
	})

</script>
