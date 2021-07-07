import settings from './settings.js'

const state = () => ({
    isActivated: false
})

const modules = {
    settings
}

// getters
const getters = {
    showCustomers: state => state.isActivated,
    getOptions: state => {
        return {
            isActivated: state.isActivated
        }
    },
}

const mutations = {
    activate: state => state.isActivated = true,
    deactivate: state => state.isActivated = false,
    setOption(state, { optionName, optionValue }) {
        Vue.set(state, optionName, optionValue);
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    modules
}