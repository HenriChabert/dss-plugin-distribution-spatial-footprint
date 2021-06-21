import settings from './settings.js'

const state = () => ({
    colorsPalette: [],
})

const modules = {
    settings
}

// getters
const getters = {
    getColorsPalette: state => state.colorsPalette,
    getOptions: state => {
        return {
            colorsPalette: state.colorsPalette,
            isActivated: true
        }
    },
}

const mutations = {
    setOption(state, { optionName, optionValue }) {
        Vue.set(state, optionName, optionValue);
    },
}

export default {
    namespaced: true,
    state,
    getters,
    modules,
    mutations
}