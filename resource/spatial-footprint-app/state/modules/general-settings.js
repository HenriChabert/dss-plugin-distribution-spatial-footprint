import { DKUApi } from '../../dku-api.js'

import location from './location.js'
import customer from './customer.js'
import competitor from './competitor.js'

const state = () => ({
    webapp: {},
    projectVariables: {},
    filteringPanel: {
        module: null,
        focusFeature: null
    },
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
            isoColorMapping[state.isochronesTypes[i].value.isochrone_type] = colorsPalette.colors ? colorsPalette.colors[i] : "#ffffff"
        }
        return isoColorMapping;
    },
    isIsochroneActive: (state, getters) => (isochroneType) => {
        return getters.getActiveIsochrones.find((iso) => iso.value.isochrone_type === isochroneType);
    },
    showFilteringPanel: state => state.filteringPanel.module !== null,
    getFilteringPanelModule: state => state.filteringPanel.module,
    getFilteringPanelFocus: state => state.filteringPanel.focusFeature
}

const mutations = {
    setIsochronesTypes(state, { isochronesTypes }) {
        state.isochronesTypes = isochronesTypes;
    },
    setActiveIsochrones(state, { activeIsochrones }) {
        state.activeIsochrones = activeIsochrones;
    },
    setProjectVariables(state, { projectVariables }) {
        state.projectVariables = projectVariables;
    },
    showFilteringPanel(state, { moduleName }) {
        state.filteringPanel.module = moduleName;
        state.filteringPanel.focusFeature = null;
    },
    showFilteringPanelAndFocus(state, { moduleName, focusFeature }) {
        state.filteringPanel.module = moduleName;
        state.filteringPanel.focusFeature = focusFeature;
    },
    hideFilteringPanel(state) {
        state.filteringPanel.module = null;
    }
}

const actions = {
    async fetchIsochronesTypes({ commit }) {
        const isochronesTypes = await DKUApi.getIsochronesTypes();
        commit('setIsochronesTypes', { isochronesTypes })
        commit('setActiveIsochrones', { activeIsochrones: isochronesTypes })
    },
    async fetchProjectVariables({ commit }) {
        const projectVariables = await DKUApi.getProjectVariables();
        commit('setProjectVariables', { projectVariables })
    },
}

export default {
    state,
    modules,
    getters,
    mutations,
    actions
}