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
