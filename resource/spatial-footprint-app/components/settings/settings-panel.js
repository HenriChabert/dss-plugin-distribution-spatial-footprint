import { SettingsForm } from './settings-form.js'
import {FilteringPanel} from "./filtering/filtering-panel.js";

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
        ]),
        panelTitle() {
            return this.showFilteringPanel ? "Filters" : "Settings"
        },
        getAvailableFilters() {
            return Object.keys(this.getModuleGetter('settings/getAvailableFilteringFeatures', this.getFilteringPanelModule))
        }
    },
    data() {
        return {
            isDropped: false,
            visibleModules: ["location"],
            modules: [{
                name: "location",
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
            if (!this.isModuleVisible(moduleName)) {
                this.visibleModules = [moduleName];
            }
        },
        toggleModuleVisibility(moduleName) {
            if (this.isModuleVisible(moduleName)) {
                this.visibleModules = this.visibleModules.filter(el => el !== moduleName);
            } else {
                this.visibleModules.push(moduleName);
            }
        }
    },
    mounted() {
        this.setActiveIsochrones(this.getIsochronesTypes)
    },
    created () {
        this.$store.dispatch('fetchIsochronesTypes');
    },
    // language=HTML
    template: `
        <div :class="['container', 'settings-panel-container', 'd-flex', 'flex-column', showFilteringPanel ? 'filtering-panel-showed' : 'no-filtering-panel']">
            <div class="settings-panel-header mt-2 d-flex align-items-center">
                <div class="go-back-btn mr-3" @click="hideFilteringPanel" v-if="showFilteringPanel"><i class="icon-arrow-left"></i></div>
                <h3 class="settings-panel-title">{{ panelTitle }}</h3>
                <div class="ml-auto" v-on:click="toggleSettingsPanel">
                    <i v-if="!isDropped" class="icon-chevron-down"></i>
                    <i v-else class="icon-chevron-up"></i>
                </div>
            </div>
            <div class="settings-panel" v-show="!isDropped"">
                <div v-if="showFilteringPanel" key="filtering-panel">
                        <filtering-panel :settingsModule="getFilteringPanelModule"></filtering-panel>
                </div>
                <div v-else key="common-settings">
                    <div class="mb-2">
                        <span>Isochrone(s) to focus on:</span>
                        <v-select v-if="getIsochronesTypes"
                            :options="getIsochronesTypes"
                            multiple
                            @input="setActiveIsochrones($event)"
                            placeholder="Select an isochrone..."
                            :value="getActiveIsochrones"
                            >
                            <template slot="open-indicator">
                                <span><i class="icon-sort-down"></i></span>
                            </template>
                        </v-select>
                    </div>
                    <div v-for="module in modules" :key="module.name">
                        <hr>
                        <settings-form
                            :settingsModule="module.name"
                            :moduleName="module.label"
                            :isVisible="isModuleVisible(module.name)"
                            v-on:update:moduleVisibility="toggleModuleVisibility(module.name)">
                        </settings-form>
                    </div>
                </div>
            </div>
        </div>`,
};

export {SettingsPanel}