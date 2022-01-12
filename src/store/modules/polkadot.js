import api from "../../api"

// initial state
const state = () => ({
    api: null
})

// getters
const getters = {
    api: (state) => {
        return state.api
    },
}

// actions
const actions = {
    initApi ({ commit }) {
        return api.then(t => commit('setApi',t))
    }
}

// mutations
const mutations = {
    setApi (state, api) {
        state.api = api;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}