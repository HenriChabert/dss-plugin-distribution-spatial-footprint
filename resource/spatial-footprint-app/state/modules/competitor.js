import settings from './settings.js'

const state = () => ({
    isActivated: false,
    colorsPalette: []
})

const modules = {
    settings
}

// getters
const getters = {
    showCompetitor: state => state.isActivated,
    getColorsPalette: state => state.colorsPalette,
    getOptions: state => {
        return {
            isActivated: state.isActivated,
            colorsPalette: state.colorsPalette
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