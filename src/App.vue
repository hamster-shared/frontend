
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
