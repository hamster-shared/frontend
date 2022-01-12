import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let routes = [
	{
		// will match everything
		path: '*',
		component: () => import('../views/404.vue'),
	},
	{
		path: '/',
		name: 'Home',
		redirect: '/market/',
	},
	{
		path: '/market/',
		name: 'Market',
		layout: "dashboard",
		meta: {
			title: 'market',
			sidebarMap: ['market'],
			breadcrumbs: ["menu.market", 'menu.computingMarket'],
		},
		component: () => import('../views/Market/ComputingMarket.vue'),
	},
	{
		path: '/my-shared/shared-resource',
		name: 'SharedResource',
		layout: "dashboard",
		meta: {
			title: 'sharedResources',
			sidebarMap: ['my-shared','shared-resource'],
			breadcrumbs: ['menu.mySharedResources', 'menu.sharedResources'],
		},
		component: () => import('../views/MyShared/SharedResource.vue'),
	},
	{
		path: '/my-shared/lease-contract',
		name: 'LeaseContract',
		layout: "dashboard",
		meta: {
			title: 'leaseContract',
			sidebarMap: ['my-shared','lease-contract'],
			breadcrumbs: ['menu.mySharedResources', 'menu.leaseContract'],
		},
		component: () => import('../views/MyShared/LeaseContract.vue'),
	},
	{
		path: '/my/service-list',
		name: 'ServiceList',
		layout: "dashboard",
		meta: {
			title: 'serviceList',
			sidebarMap: ['my','service-list'],
			breadcrumbs: ['menu.myUsageResources', 'menu.serviceList'],
		},
		component: () => import('../views/My/ServiceList.vue'),
	},
	{
		path: '/my/order-list',
		name: 'OrderList',
		layout: "dashboard",
		meta: {
			title: 'orderList',
			sidebarMap: ['my','order-list'],
			breadcrumbs: ['menu.myUsageResources', 'menu.orderList'],
		},
		component: () => import('../views/My/OrderList.vue'),
	},
	{
		path: '/dashboards/',
		name: 'Dashboard',
		layout: "dashboard",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		meta: {
			title: 'Default Dashboard',
			sidebarMap: ['dashboards'],
			breadcrumbs: ['Dashboards', 'CRM'],
		},
		component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboards/Default.vue'),
	},
	{
		path: '/dashboards/crm',
		name: 'DashboardsCRM',
		layout: "dashboard",
		meta: {
			title: 'CRM',
			sidebarMap: ['dashboards'],
			breadcrumbs: ['Dashboards', 'CRM'],
		},
		component: () => import('../views/Dashboards/CRM.vue'),
	},
	{
		path: '/pages/profile/profile-overview',
		name: 'ProfileOverview',
		layout: "dashboard",
		meta: {
			title: 'Overview',
			layoutClass: 'layout-profile',
			sidebarMap: ['pages', 'profile', 'profile-overview'],
			breadcrumbs: ['Pages', 'Profile', 'Overview'],
		},
		component: () => import('../views/Profile/ProfileOverview.vue'),
	},
	{
		path: '/pages/profile/all-projects',
		name: 'AllProjects',
		layout: "dashboard",
		meta: {
			title: 'All Projects',
			layoutClass: 'layout-profile',
			sidebarMap: ['pages', 'profile', 'all-projects'],
			breadcrumbs: ['Pages', 'Profile', 'All Projects'],
		},
		component: () => import('../views/Profile/AllProjects.vue'),
	},
	{
		path: '/pages/users/new-user',
		name: 'NewUser',
		layout: "dashboard",
		meta: {
			title: 'New User',
			sidebarMap: ['pages', 'users', 'new-user'],
			breadcrumbs: ['Pages', 'Users', 'New User'],
		},
		component: () => import('../views/Users/New.vue'),
	},
	{
		path: '/pages/account/settings',
		name: 'Settings',
		layout: "dashboard",
		meta: {
			title: 'Settings',
			sidebarMap: ['pages', 'account', 'settings'],
			breadcrumbs: ['Pages', 'Account', 'Settings'],
		},
		component: () => import('../views/Account/Settings.vue'),
	},
	{
		path: '/pages/account/billing',
		name: 'Billing',
		layout: "dashboard",
		meta: {
			title: 'Billing',
			sidebarMap: ['pages', 'account', 'billing'],
			breadcrumbs: ['Pages', 'Account', 'Billing'],
		},
		component: () => import('../views/Account/Billing.vue'),
	},
	{
		path: '/pages/account/invoice',
		name: 'Invoice',
		layout: "dashboard",
		meta: {
			title: 'Invoice',
			sidebarMap: ['pages', 'account', 'invoice'],
			breadcrumbs: ['Pages', 'Account', 'Invoice'],
		},
		component: () => import('../views/Account/Invoice.vue'),
	},
	{
		path: '/pages/projects/timeline',
		name: 'Timeline',
		layout: "dashboard",
		meta: {
			title: 'Timeline',
			sidebarMap: ['pages', 'projects', 'timeline'],
			breadcrumbs: ['Pages', 'Projects', 'Timeline'],
		},
		component: () => import('../views/Projects/Timeline.vue'),
	},
	{
		path: '/pages/pricing',
		name: 'Pricing',
		meta: {
			layoutClass: 'layout-pricing',
			title: 'Pricing',
		},
		component: () => import('../views/Pricing.vue'),
	},
	{
		path: '/pages/rtl',
		name: 'RTL',
		layout: "dashboard-rtl",
		meta: {
			layoutClass: 'dashboard-rtl',
			title: 'RTL',
			sidebarMap: ['pages', 'rtl'],
			breadcrumbs: ['Pages', 'RTL'],
		},
		component: () => import('../views/RTL.vue'),
	},
	{
		path: '/pages/charts',
		name: 'Charts',
		layout: "dashboard",
		meta: {
			layoutClass: 'dashboard',
			title: 'Charts',
			sidebarMap: ['pages', 'charts'],
			breadcrumbs: ['Pages', 'Charts'],
		},
		component: () => import('../views/Charts.vue'),
	},
	{
		path: '/pages/alerts',
		name: 'Alerts',
		layout: "dashboard",
		meta: {
			layoutClass: 'dashboard',
			title: 'Alerts',
			sidebarMap: ['pages', 'alerts'],
			breadcrumbs: ['Pages', 'Alerts'],
		},
		component: () => import('../views/Alerts.vue'),
	},
	{
		path: '/pages/notifications',
		name: 'Notifications',
		layout: "dashboard",
		meta: {
			layoutClass: 'dashboard',
			title: 'Notifications',
			sidebarMap: ['pages', 'notifications'],
			breadcrumbs: ['Pages', 'Notifications'],
		},
		component: () => import('../views/Notifications.vue'),
	},
	{
		path: '/applications/calendar',
		name: 'Calendar',
		layout: "dashboard",
		meta: {
			title: 'Calendar',
			sidebarMap: ['applications'],
			breadcrumbs: ['Applications', 'Calendar'],
		},
		component: () => import('../views/Applications/Calendar.vue'),
	},
	{
		path: '/applications/kanban',
		name: 'Kanban',
		layout: "dashboard",
		meta: {
			title: 'Kanban',
			sidebarMap: ['applications'],
			breadcrumbs: ['Applications', 'Kanban'],
		},
		component: () => import('../views/Applications/Kanban.vue'),
	},
	{
		path: '/applications/wizard',
		name: 'Wizard',
		layout: "dashboard",
		meta: {
			title: 'Wizard',
			sidebarMap: ['applications'],
			breadcrumbs: ['Applications', 'Wizard'],
		},
		component: () => import('../views/Applications/Wizard.vue'),
	},
	{
		path: '/applications/datatables',
		name: 'DataTables',
		layout: "dashboard",
		meta: {
			title: 'DataTables',
			sidebarMap: ['applications'],
			breadcrumbs: ['Applications', 'DataTables'],
		},
		component: () => import('../views/Applications/DataTables.vue'),
	},
	{
		path: '/ecommerce/products/new-product',
		name: 'New Product',
		layout: "dashboard",
		meta: {
			layoutClass: 'layout-profile',
			title: 'New Product',
			sidebarMap: ['ecommerce', 'products', 'new-product'],
			breadcrumbs: ['Ecommerce', 'Products', 'New Product'],
		},
		component: () => import('../views/Ecommerce/Products/NewProduct.vue'),
	},
	{
		path: '/ecommerce/products/edit-product',
		name: 'Edit Product',
		layout: "dashboard",
		meta: {
			title: 'Edit Product',
			sidebarMap: ['ecommerce', 'products', 'edit-product'],
			breadcrumbs: ['Ecommerce', 'Products', 'Edit Product'],
		},
		component: () => import('../views/Ecommerce/Products/EditProduct.vue'),
	},
	{
		path: '/ecommerce/products/product-page',
		name: 'Product Page',
		layout: "dashboard",
		meta: {
			title: 'Product Page',
			sidebarMap: ['ecommerce', 'products', 'product-page'],
			breadcrumbs: ['Ecommerce', 'Products', 'Product Page'],
		},
		component: () => import('../views/Ecommerce/Products/ProductPage.vue'),
	},
	{
		path: '/ecommerce/orders/orders-list',
		name: 'Orders List',
		layout: "dashboard",
		meta: {
			title: 'Orders List',
			sidebarMap: ['ecommerce', 'orders', 'orders-list'],
			breadcrumbs: ['Ecommerce', 'Orders', 'Orders List'],
		},
		component: () => import('../views/Ecommerce/Orders/OrdersList.vue'),
	},
	{
		path: '/ecommerce/orders/orders-details',
		name: 'Orders Details',
		layout: "dashboard",
		meta: {
			title: 'Orders Details',
			sidebarMap: ['ecommerce', 'orders', 'orders-details'],
			breadcrumbs: ['Ecommerce', 'Orders', 'Orders Details'],
		},
		component: () => import('../views/Ecommerce/Orders/OrdersDetails.vue'),
	},
	{
		path: '/authentication/sign-up/basic',
		name: 'Basic Sign Up',
		meta: {
			layoutClass: 'layout-sign-up',
			title: 'Basic Sign Up',
			sidebarMap: ['authentication', 'sign-up', 'basic'],
			breadcrumbs: ['Authentication', 'Sign Up', 'Basic'],
		},
		component: () => import('../views/Authentication/Sign-Up/Basic.vue'),
	},
	{
		path: '/authentication/sign-up/cover',
		name: 'Cover Sign Up',
		meta: {
			layoutClass: 'layout-sign-up-cover',
			title: 'Cover Sign Up',
			sidebarMap: ['authentication', 'sign-up', 'cover'],
			breadcrumbs: ['Authentication', 'Sign Up', 'Cover'],
		},
		component: () => import('../views/Authentication/Sign-Up/Cover.vue'),
	},
	{
		path: '/authentication/sign-up/illustration',
		name: 'Illustration Sign Up',
		meta: {
			layoutClass: 'layout-sign-up-illustration',
			title: 'Illustration Sign Up',
			sidebarMap: ['authentication', 'sign-up', 'illustration'],
			breadcrumbs: ['Authentication', 'Sign Up', 'Illustration'],
			nofooter: true,
		},
		component: () => import('../views/Authentication/Sign-Up/Illustration.vue'),
	},
	{
		path: '/layout',
		name: 'Layout',
		layout: "dashboard",
		component: () => import('../views/Layout.vue'),
	},
]

// Adding layout property from each route to the meta
// object so it can be accessed later.
function addLayoutToRoute( route, parentLayout = "default" )
{
	route.meta = route.meta || {} ;
	route.meta.layout = route.layout || parentLayout ;

	if( route.children )
	{
		route.children = route.children.map( ( childRoute ) => addLayoutToRoute( childRoute, route.meta.layout ) ) ;
	}
	return route ;
}

routes = routes.map( ( route ) => addLayoutToRoute( route ) ) ;

const router = new VueRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior (to, from, savedPosition) {
		if ( to.hash ) {
			return {
				selector: to.hash,
				behavior: 'smooth',
			}
		}
		return {
			x: 0,
			y: 0,
			behavior: 'smooth',
		}
	}
})

export default router
