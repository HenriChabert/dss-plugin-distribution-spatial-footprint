import generalSettings from './modules/general-settings.js'
import map from './modules/map.js'
import {DKUApi} from "../dku-api.js";

Vue.use(Vuex)

const state = {
    locations: {
        basic: [],
        competitor: []
    },
    customers: []
}

const modules = {
    generalSettings,
    map
}

const getters = {
    getLocations: (state) => (moduleName) => state.locations[moduleName],
    getLocationsIdentifier: (state) => (moduleName) => state.locations[moduleName].map((l) => l.location_identifier),
    getAllLocations: (state) => _.concat(state.locations.basic, state.locations.competitor),
    getCustomers: (state) => state.customers,
    getCustomersIdentifier: (state) => state.customers.map((c) => c.included_customer_id),
    getLocation: (state) => (locID, moduleName) => state.locations[moduleName].find((loc) => loc.location_id === locID),
    getLocationActiveIsochrones: (state, getters, rootState, rootGetters) => (locID, moduleName) => {
        const locationIsochrones = getters.getLocation(locID, moduleName).isochrones;
        const activeLocationIsochrones = locationIsochrones
            .filter((iso) => rootGetters.isIsochroneActive(iso.isochrone_type))
        activeLocationIsochrones.sort((a, b) => b.isochrone_amplitude - a.isochrone_amplitude)
        return activeLocationIsochrones
    },
    showCompetitor: (state, getters, rootState, rootGetters) => {
        return rootGetters['competitor/showCompetitor']
    },
    showCustomers: (state, getters, rootState, rootGetters) => {
        return rootGetters['customer/showCustomers']
    }
}

const mutations = {
    updateLocations(state, { newLocations, moduleName }) {
        state.locations[moduleName] = newLocations;
    },
    updateCustomers(state, { newCustomers }) {
        state.customers = newCustomers;
    },
}

const actions = {
    async getFilteredLocations ({ commit, state }, moduleName) {
        const settings = state.generalSettings[moduleName].settings;
        const filteredLocations = await DKUApi.getFilteredLocations(
            settings.filtering,
            settings.sampling
        );
        commit('updateLocations', { newLocations: filteredLocations, moduleName });
    },
    async getFilteredCustomers ({ commit, state, getters }) {
        const settings = state.generalSettings.customer.settings;
        const filtering = settings.filtering;
        filtering.location_id = getters.getAllLocations.map((loc) => loc.location_id)
        const filteredCustomers = await DKUApi.getFilteredCustomers(
            filtering,
            settings.sampling
        );
        commit('updateCustomers', { newCustomers: filteredCustomers });
    }
}

export default new Vuex.Store({
    state,
    modules,
    getters,
    actions,
    mutations
})