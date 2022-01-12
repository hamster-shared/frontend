// initial state
const state = () => ({
    accounts:[],
    current: null
})

// getters
const getters = {
    accountList: (state) => {
        return state.accounts
    },
    currentAccount: (state) => {
        return state.current
    }
}

// actions
const actions = {
}

// mutations
const mutations = {
    setAccounts (state, accounts) {
        state.accounts = accounts;
    },
    setCurrent (state, account) {
        state.current = account
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}