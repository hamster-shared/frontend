<!-- 
	This is the main page of the application, the layout component is used here,
	and the router-view is passed to it.
	Layout component is dynamically declared based on the layout for each route,
	specified in routes list router/index.js .
 -->

<template>
	<div id="app">
		<component v-if="api" :is="layout">
			<router-view />
		</component>
    <div v-else class="example">
      <a-spin size="large"/>
    </div>
	</div>
</template>

<script>
  import {mapGetters} from "vuex";

  export default ({
		computed: {
      ...mapGetters("polkadot", ["api"]),
			// Sets components name based on current route's specified layout, defaults to
			// <layout-default></layout-default> component.
			layout() {
				return "layout-" + ( this.$route.meta.layout || "default" ).toLowerCase() ;
			}
		},
    created(){
      this.$store.dispatch("polkadot/initApi")
    }
	})
	
</script>

<style lang="scss">

.example {
  text-align: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  width: 100%;
  height: 100vh;
  padding: 30vh;
}
</style>