import { SettingsForm } from './settings-form.js'
import {FilteringPanel} from "./filtering/filtering-panel.js";

const MEANS_OF_TRANSPORTATION = {
    "car": ["driving-car"],
    "trunk": ["driving-hgv"],
    "cycling": ["cycling-regular", "cycling-road", "cycling-mountain", "cycling-electric"],
    "foot": ["foot-walking", "foot-hiking"]
}

const SettingsPanel = {
    name: "settings-panel",
    components: {
        'settings-form': SettingsForm,
        'v-select': VueSelect.VueSelect,
        'filtering-panel': FilteringPanel
    },
    computed: {
        ...Vuex.mapGetters([
            'getIsochronesTypes',
            'getActiveIsochrones',
            'getFilteringPanelModule',
            'showFilteringPanel',
            'getFilteringPanelTitle',
            'getProjectVariables'
        ]),
        panelTitle() {
            return this.showFilteringPanel ? _.capitalize(this.getFilteringPanelTitle) : "Settings";
        },
        meanOfTransportationIcon() {
            const usedAPI = this.getProjectVariables.isochrones_api_to_use;
            const usedMeanOfTransportation = this.getProjectVariables[`transportation_mode_${usedAPI}`];
            const mappedMOT = _.pickBy(MEANS_OF_TRANSPORTATION, (v) => v.includes(usedMeanOfTransportation));
            return `../../resource/spatial-footprint-app/img/svg/${/*Object.keys(mappedMOT)[0] || */"foot"}.svg`;
        }
    },
    data() {
        return {
            isDropped: false,
            visibleModules: ["basic"],
            modules: [{
                name: "basic",
                label: "Network Analysis"
            }, {
                name: "competitor",
                label: "Comparative Network Analysis"
            }, {
                name: "customer",
                label: "Customer Analysis"
            }]
        };
    },
    methods: {
        getModuleGetter(getter, module) {
            return this.$store.getters.getModuleGetter(module, getter);
        },
        toggleSettingsPanel() {
           this.isDropped = !this.isDropped;
        },
        setActiveIsochrones(activeIsochrones) {
            this.$store.commit("setActiveIsochrones", { activeIsochrones });
        },
        hideFilteringPanel() {
            this.$store.commit('hideFilteringPanel');
        },
        isModuleVisible(moduleName) {
            return this.visibleModules.includes(moduleName);
        },
        focusOnModule(moduleName) {
            this.visibleModules = this.isModuleVisible(moduleName) ? [] : [moduleName];
        }
    },
    mounted() {
        this.setActiveIsochrones(this.getIsochronesTypes);
        this.$store.dispatch('fetchProjectVariables');
    },
    created () {
        this.$store.dispatch('fetchIsochronesTypes');
    },
    // language=HTML
    template: `
        <div :class="['settings-panel-container', 'd-flex', 'flex-column', showFilteringPanel ? 'filtering-panel-showed' : 'no-filtering-panel']">
            <div class="settings-padded settings-panel-header mt-2 mb-3 d-flex align-items-center">
                <div class="go-back-arrow me-3" @click="hideFilteringPanel" v-if="showFilteringPanel"><i class="icon-arrow-left"></i></div>
                <h3 class="settings-panel-title">{{ panelTitle }}</h3>
                <div class="ms-auto" v-on:click="toggleSettingsPanel">
                    <i v-if="!isDropped" class="icon-chevron-down"></i>
                    <i v-else class="icon-chevron-up"></i>
                </div>
            </div>
            <div class="settings-panel" v-show="!isDropped"">
                <div v-if="showFilteringPanel" key="filtering-panel" class="settings-padded">
                    <filtering-panel :settingsModule="getFilteringPanelModule"></filtering-panel>
                </div>
                <div v-show="!showFilteringPanel" key="common-settings">
                    <div class="isochrones-section settings-padded mb-3">
                        <span>
                            <img :src="meanOfTransportationIcon" alt="mean of transportation" />
                            Isochrone(s) to focus on:</span>
                        <v-select v-if="getIsochronesTypes"
                            :options="getIsochronesTypes"
                            multiple
                            @input="setActiveIsochrones($event)"
                            placeholder="Select an isochrone..."
                            :value="getActiveIsochrones"
                            :searchable="false"
                            :filterable="false"
                            class="mt-1 mb-5"
                            >
                            
                            <template #selected-option-container="{ option, deselect }">
                              <div class="vs__selected">
                                  {{ option.label }}
                                  <button type="button"
                                          :title="'Deselect ' + option.label"
                                          :aria-label="'Deselect ' + option.label"
                                          class="vs__deselect"
                                          v-on:click="deselect(option)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                        <path d="M7 0.579687L6.42031 0L3.5 2.92031L0.579687 0L0 0.579687L2.92031 3.5L0 6.42031L0.579687 7L3.5 4.07969L6.42031 7L7 6.42031L4.07969 3.5L7 0.579687Z" fill="#222222"/>
                                    </svg>
                                  </button>
                              </div>
                            </template>
                            <template slot="open-indicator">
                                <span><i class="icon-sort-down"></i></span>
                            </template>
                        </v-select>
                    </div>
                    <div v-for="module in modules" :key="module.name">
                        <hr>
                        <settings-form
                            class="settings-padded mt-3"
                            :settingsModule="module.name"
                            :moduleName="module.label"
                            :isVisible="isModuleVisible(module.name)"
                            v-on:update:moduleVisibility="focusOnModule(module.name)">
                        </settings-form>
                    </div>
                </div>
            </div>
        </div>`,
};

export {SettingsPanel}