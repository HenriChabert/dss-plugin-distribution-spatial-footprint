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
    async fetchAvailableFilteringFeatures({ commit, rootState }, moduleName) {
        let availableFilteringFeatures;
        if (moduleName === "customer") {
            const zones = rootState.map.zones;
            const preFilters = {
                location_id: _.concat(zones.location, zones.competitor).map((z) => z.location_id)
            }
            availableFilteringFeatures = await DKUApi.getAvailableFilteringFeatures("customer", preFilters);
        } else {
            availableFilteringFeatures = await DKUApi.getAvailableFilteringFeatures("location");
        }
        commit('setAvailableFilteringFeatures', { availableFilteringFeatures })

        if (moduleName === "location") {
            commit('setFilteringFeature', {
                featureName: 'location_identifier',
                filters: [availableFilteringFeatures.location_identifier[0]]
            })
        }
    },

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}