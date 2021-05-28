import { DKUApi } from '../../dku-api.js'

import location from './location.js'
import customer from './customer.js'
import competitor from './competitor.js'

const state = () => ({
    webapp: {},
    isochronesTypes: [],
    activeIsochrones: []
})

const modules = {
    location,
    customer,
    competitor
}

// getters
const getters = {
    getWebAppSettings: state => state.webapp,
    getModuleGetter: (state, getters, rootState, rootGetters) => (moduleName, getter) => {
        return rootGetters[`${moduleName}/${getter}`];
    },
    getIsochronesTypes: state => state.isochronesTypes,
    getActiveIsochrones: state => state.activeIsochrones,
    getIsochronesColorMapping: (state, getters) => (moduleName) => {
        const colorsPalette = getters.getModuleGetter(moduleName, 'getColorsPalette');
        const isoColorMapping = {};
        for (let i=0; i < state.isochronesTypes.length; i++) {
            isoColorMapping[state.isochronesTypes[i].value] = colorsPalette.colors ? colorsPalette.colors[i] : "#ffffff"
        }
        return isoColorMapping;
    },
}

const mutations = {
    setIsochronesTypes(state, { isochronesTypes }) {
        state.isochronesTypes = isochronesTypes;
    },
    setActiveIsochrones(state, { activeIsochrones }) {
        state.activeIsochrones = activeIsochrones;
    },
}

const actions = {
    fetchIsochronesTypes({ commit }) {
        const isochronesTypes = DKUApi.getIsochronesTypes();
        commit('setIsochronesTypes', { isochronesTypes })
    },
}

export default {
    state,
    modules,
    getters,
    mutations,
    actions
}