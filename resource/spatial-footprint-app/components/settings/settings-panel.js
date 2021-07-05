import { SettingsForm } from './settings-form.js'
import { FilteringPanel } from "./filtering/filtering-panel.js";

const SettingsPanel = {
    name: "settings-panel",
    components: {
        'settings-form': SettingsForm,
        'filtering-panel': FilteringPanel
    },
    computed: {
        ...Vuex.mapGetters([
            'getIsochronesTypes',
            'getActiveIsochrones',
            'getFilteringPanelModule',
            'showFilteringPanel',
            'getFilteringPanelTitle',
            'getProjectVariables',
            'getMeanOfTransportation'
        ]),
        panelTitle() {
            return this.showFilteringPanel ? _.capitalize(this.getFilteringPanelTitle) : "Settings";
        },
        meanOfTransportationIcon() {
            return `../../resource/spatial-footprint-app/img/svg/icon-dku-${this.getMeanOfTransportation}.svg`;
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
        },
        setMeanOfTransportation() {
            const usedMeanOfTransportation = this.getProjectVariables["main_transportation_mode"];
            this.$store.commit('setMeanOfTransportation', { newMeanOfTransportation: _.lowerCase(usedMeanOfTransportation) })
        },
    },
    mounted() {
        this.setActiveIsochrones(this.getIsochronesTypes);
        this.$store.dispatch('fetchIsochronesTypes');
        this.$store.dispatch('fetchProjectVariables').then(() => {
            this.setMeanOfTransportation();
        });
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
                            <img :src="meanOfTransportationIcon" alt="mean of transportation" v-if="getProjectVariables.isochrones_api_to_use" class="me-2" width="14px" height="14px"/>
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
                                <span class="vs__selected">
                                    {{ option.label }}
                                    <button type="button"
                                        :title="'Deselect ' + option.label"
                                        :aria-label="'Deselect ' + option.label"
                                        class="vs__deselect"
                                        @click="deselect(option)"
                                        ref="deselectButtons">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                            <path d="M7 0.579687L6.42031 0L3.5 2.92031L0.579687 0L0 0.579687L2.92031 3.5L0 6.42031L0.579687 7L3.5 4.07969L6.42031 7L7 6.42031L4.07969 3.5L7 0.579687Z" fill="#222222"/>
                                        </svg>
                                    </button>
                                </span>
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