import { DKUApi } from '../../dku-api.js'
import {findByAttribute} from "../../utils.js";

const DEFAULT_CENTER = [48.864716, 2.349014];
const DEFAULT_ZOOM = 12;

const state = () => ({
    zoom: DEFAULT_ZOOM,
    center: DEFAULT_CENTER,
    tileLayerUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    zones: {
        location: [],
        competitor: []
    },
    customers: []
})

// getters
const getters = {
    getZones: (state) => (moduleName) => state.zones[moduleName],
    getCustomers: (state) => state.customers,
    tileLayerUrl: (state) => state.tileLayerUrl,
    zoom: (state) => state.zoom,
    getZone: (state) => (zoneID, moduleName) => state.zones[moduleName].find((zone) => zone.location_id === zoneID),
    getZoneActiveIsochrones: (state, getters, rootState, rootGetters) => (zoneID, moduleName) => {
        const activeIsochronesTypes = rootGetters.getActiveIsochrones;
        return getters.getZone(zoneID, moduleName).isochrones
            .slice().reverse()
            .filter((iso) => activeIsochronesTypes.find((acIso) => acIso.value.isochrone_type === iso.isochrone_type));
    },
    showCompetitor: (state, getters, rootState, rootGetters) => {
        return rootGetters['competitor/showCompetitor']
    },
    showCustomers: (state, getters, rootState, rootGetters) => {
        return rootGetters['customer/showCustomers']
    }
}

// actions
const actions = {
    async getFilteredZones ({ commit, state, rootGetters, rootState }, moduleName) {
        const settings = rootState.generalSettings[moduleName].settings;
        const filteredZones = await DKUApi.getFilteredZones(
            settings.filtering,
            settings.sampling
        );
        commit('updateZones', { newZones: filteredZones, moduleName });
    },
    async getFilteredCustomers ({ commit, state, rootGetters, rootState }) {
        const settings = rootState.generalSettings.customer.settings;
        const filtering = settings.filtering;
        filtering.location_id = _.concat(state.zones.location, state.zones.competitor).map((z) => z.location_id)
        const filteredCustomers = await DKUApi.getFilteredCustomers(
            filtering,
            settings.sampling
        );
        commit('updateCustomers', { newCustomers: filteredCustomers });
    }
}

// mutations
const mutations = {
    updateZones(state, { newZones, moduleName }) {
        state.zones[moduleName] = newZones;
    },
    updateCustomers(state, { newCustomers }) {
        state.customers = newCustomers;
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}