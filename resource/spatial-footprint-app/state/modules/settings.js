import {DKUApi} from "../../dku-api.js";

const state = () => ({
    availableFilteringFeatures: {},
    availableIdentifiers: [],
    activatedTab: "individuals",
    filtering: {
        individuals: {},
        filters: {}
    },
    sampling: {
        type: "nRows",
        value: 100
    }
})

// getters
const getters = {
    getFiltering: state => state.filtering[state.activatedTab],
    getSampling: state => state.sampling,
    getFeatureFilters: (state) => (featureName) => {
        return state.filtering[state.activatedTab][featureName] || [];
    },
    getAvailableFilteringFeatures: (state) => {
        return state.availableFilteringFeatures;
    },
    getAvailableIdentifiers: (state) => {
        return state.availableIdentifiers;
    },
    filtersCount: (state, getters) => (featureName) => {
        return getters.getFeatureFilters(featureName).length
    },
    isItemSelected: (state, getters) => (featureName, item) => {
        return getters.getFeatureFilters(featureName).includes(item)
    },
    getActivatedTab: (state) => {
        return state.activatedTab
    },
    getCustomersPreFilters: (state, getters, rootState, rootGetters) => {
        const allAmplitudes = [5, 10, 15, 30, 45, 60];
        const maxActiveAmplitude = Math.max(...rootGetters.getActiveIsochrones.map((iso) => iso.value.isochrone_amplitude));
        return {
            location_uuid: rootGetters.getAllLocations.map((l) => l.location_uuid),
            isochrone_amplitude: allAmplitudes.filter((a) => a <= maxActiveAmplitude)
        }
    }
}

// mutations
const mutations = {
    setFilteringFeature(state, { featureName, filters }) {
        if (featureName === "id") {
            Vue.set(state.filtering.individuals, featureName, filters)
        } else {
            Vue.set(state.filtering.filters, featureName, filters)
        }
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
    setAvailableIdentifiers(state, { availableIdentifiers }) {
        state.availableIdentifiers = availableIdentifiers;
    },
    setActivatedTab(state, { newActivatedTab }) {
        state.activatedTab = newActivatedTab;
    }
}

const actions = {
    async fetchAvailableFilteringFeatures({ commit, getters, rootGetters }, moduleName) {
        let availableFilteringFeatures;
        if (moduleName === "customer") {
            const preFilters = getters.getCustomersPreFilters;
            availableFilteringFeatures = await DKUApi.getAvailableFilteringFeatures("customer", preFilters);
        } else {
            availableFilteringFeatures = await DKUApi.getAvailableFilteringFeatures("location");
        }
        commit('setAvailableFilteringFeatures', { availableFilteringFeatures })
    },
    async fetchAvailableIdentifiers({ commit, getters, rootGetters }, moduleName) {
        let availableIdentifiers;
        if (moduleName === "customer") {
            const preFilters = getters.getCustomersPreFilters;
            if (preFilters.location_uuid.length > 0) {
                availableIdentifiers = await DKUApi.getAvailableIdentifiers("customer", preFilters);
            } else {
                availableIdentifiers = [];
            }
        } else {
            availableIdentifiers = await DKUApi.getAvailableIdentifiers("location");
        }
        commit('setAvailableIdentifiers', { availableIdentifiers })
    },

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}