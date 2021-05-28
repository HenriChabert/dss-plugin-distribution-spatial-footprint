import { DKUApi } from '../../dku-api.js'
import {findByAttribute} from "../../utils.js";

const DEFAULT_CENTER = [48.864716, 2.349014];
const DEFAULT_ZOOM = 12;

const state = () => ({
    zoom: DEFAULT_ZOOM,
    center: DEFAULT_CENTER,
    tileLayerUrl: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    zones: {
        location: [],
        competitor: []
    },
})

// getters
const getters = {
    lastZoneCenter: (state, getters) => getters.zonesCount ? state.zones['location'][getters.zonesCount - 1]?.latLng : state.center,
    zonesCount: (state) => state.zones['location'].length,
    getZones: (state) => (moduleName) => state.zones[moduleName],
    tileLayerUrl: (state) => state.tileLayerUrl,
    zoom: (state) => state.zoom,
    getZone: (state) => (zoneName, moduleName) => state.zones[moduleName].find((zone) => zone.name === zoneName),
    getZoneActiveIsochrones: (state, getters, rootState, rootGetters) => (zoneName, moduleName) => {
        const activeIsochronesTypes = rootGetters.getActiveIsochrones;
        return getters.getZone(zoneName, moduleName).isochrones
            .slice().reverse()
            .filter((iso) => findByAttribute(activeIsochronesTypes, 'value', iso.name));
    },
    showCompetitor: (state, getters, rootState, rootGetters) => {
        return rootGetters['competitor/showCompetitor']
    },
    showCustomers: (state, getters, rootState, rootGetters) => {
        return rootGetters['competitor/showCustomers']
    }
}

// actions
const actions = {
    getFilteredZones ({ commit, state, rootGetters, rootState }, moduleName) {
        const settings = rootState.generalSettings[moduleName].settings;
        const filteredZones = DKUApi.getFilteredZones(
            settings.filtering,
            settings.sampling
        );
        commit('updateZones', { newZones: filteredZones, moduleName });
    }
}

// mutations
const mutations = {
    updateZones(state, { newZones, moduleName }) {
        state.zones[moduleName] = newZones;
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}