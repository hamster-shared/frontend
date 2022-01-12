import Vue from 'vue'
import Vuex from 'vuex'
import account from './modules/account'
import polkadot from "./modules/polkadot";
import lang from "./modules/lang"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        account,
        polkadot,
        lang
    },
})
