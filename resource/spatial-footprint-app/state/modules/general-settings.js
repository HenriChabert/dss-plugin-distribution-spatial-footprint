import { DKUApi } from '../../dku-api.js'

import location from './location.js'
import customer from './customer.js'
import competitor from './competitor.js'

const state = () => ({
    webapp: {},
    projectVariables: {},
    filteringPanelModule: null,
    filteringPanelFocus: null,
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
    showFilteringPanel: state => state.filteringPanelModule !== null,
    getFilteringPanelModule: state => state.filteringPanelModule,
    getFilteringPanelFocus: state => state.filteringPanelFocus
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
        state.filteringPanelModule = moduleName;
        state.filteringPanelFocus = null;
    },
    showFilteringPanelAndFocus(state, { moduleName, focusFeature }) {
        state.filteringPanelModule = moduleName;
        state.filteringPanelFocus = focusFeature;
    },
    hideFilteringPanel(state) {
        state.filteringPanelModule = null;
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