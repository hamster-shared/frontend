import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
import enUS from "ant-design-vue/lib/locale/en_US";

const state = {
    lang: enUS
}

const mutations = {
    CHANGE_LANG: (state, langType) => {
        state.lang = langType;
    }
}

const actions = {
    changeLang({commit}, langType){
        commit('CHANGE_LANG', langType)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
