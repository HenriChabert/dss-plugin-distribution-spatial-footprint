import {DKUApi} from "../../dku-api.js";

const state = () => ({
    availableFilteringFeatures: {},
    filtering: {},
    sampling: {
        type: "nRows",
        value: 100
    }
})

// getters
const getters = {
    getFiltering: state => state.filtering,
    getSampling: state => state.sampling,
    getFeatureFilters: (state) => (featureName) => {
        return state.filtering[featureName] || [];
    },
    getAvailableFilteringFeatures: (state) => {
        return state.availableFilteringFeatures;
    },
    filtersCount: (state, getters) => (featureName) => {
        return getters.getFeatureFilters(featureName).length
    },
    isItemSelected: (state, getters) => (featureName, item) => {
        return getters.getFeatureFilters(featureName).includes(item)
    }
}

// mutations
const mutations = {
    setFilteringFeature(state, { featureName, filters }) {
        Vue.set(state.filtering, featureName, filters)
    },
    setSamplingValue(state, samplingValue) {
        state.sampling.value = parseInt(samplingValue);
    },
    setSamplingType(state, samplingType) {
        state.sampling.type = samplingType;
    },
    setAvailableFilteringFeatures(state, { availableFilteringFeatures }) {
        state.availableFilteringFeatures = availableFilteringFeatures;
    },
}

const actions = {
    async fetchAvailableFilteringFeatures({ commit }, moduleName) {
        const moduleNameType = moduleName === "customer" ? "customer" : "location"
        const availableFilteringFeatures = await DKUApi.getAvailableFilteringFeatures(moduleNameType);
        commit('setAvailableFilteringFeatures', { availableFilteringFeatures })
    },

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}