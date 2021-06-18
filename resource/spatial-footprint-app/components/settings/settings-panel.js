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
            'getFilteringPanelTitle'
        ]),
        panelTitle() {
            return this.showFilteringPanel ? _.capitalize(this.getFilteringPanelTitle) : "Settings";
        },
        getTransportationIconSVG() {
            return "M6.28125 3.0625C6.94141 3.0625 7.5 2.5293 7.5 1.84375C7.5 1.18359 6.94141 0.625 6.28125 0.625C5.5957 0.625 5.0625 1.18359 5.0625 1.84375C5.0625 2.5293 5.5957 3.0625 6.28125 3.0625ZM8.66797 6.87109L8.08398 6.56641L7.83008 5.80469C7.44922 4.6875 6.4082 3.90039 5.24023 3.875C4.32617 3.875 3.81836 4.1543 2.87891 4.53516C2.32031 4.73828 1.86328 5.16992 1.60938 5.70312L1.43164 6.0332C1.22852 6.43945 1.40625 6.92188 1.78711 7.125C2.19336 7.32812 2.67578 7.17578 2.87891 6.76953L3.05664 6.41406C3.13281 6.23633 3.28516 6.10938 3.46289 6.0332L4.14844 5.75391L3.76758 7.30273C3.61523 7.83594 3.76758 8.39453 4.14844 8.80078L5.64648 10.4512C5.84961 10.6543 5.97656 10.9082 6.02734 11.1621L6.50977 13.0156C6.61133 13.4473 7.04297 13.7266 7.47461 13.5996C7.93164 13.498 8.18555 13.0664 8.08398 12.6348L7.52539 10.375C7.44922 10.0957 7.32227 9.86719 7.14453 9.66406L5.97656 8.39453L6.4082 6.66797L6.56055 7.07422C6.6875 7.48047 6.99219 7.81055 7.37305 8.01367L7.95703 8.31836C8.33789 8.52148 8.82031 8.34375 9.02344 7.96289C9.22656 7.55664 9.07422 7.04883 8.66797 6.87109ZM2.85352 10.4258C2.77734 10.6289 2.65039 10.832 2.49805 10.9844L1.22852 12.2539C0.898438 12.5586 0.898438 13.0918 1.22852 13.3965C1.5332 13.7266 2.06641 13.7266 2.37109 13.3965L3.89453 11.8984C4.04688 11.7461 4.14844 11.543 4.25 11.3398L4.58008 10.4766C3.18359 8.95312 3.61523 9.43555 3.38672 9.13086L2.85352 10.4258Z";
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
        this.setActiveIsochrones(this.getIsochronesTypes)
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
                    <button class="go-back-btn me-3" @click="hideFilteringPanel" v-if="showFilteringPanel"><i class="icon-arrow-left"></i> BACK</button>
                </div>
                <div v-show="!showFilteringPanel" key="common-settings">
                    <div class="settings-padded mb-3">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14" fill="none">
                                <path :d="getTransportationIconSVG" fill="black"/>
                            </svg>
                            Isochrone(s) to focus on:</span>
                        <v-select v-if="getIsochronesTypes"
                            :options="getIsochronesTypes"
                            multiple
                            @input="setActiveIsochrones($event)"
                            placeholder="Select an isochrone..."
                            :value="getActiveIsochrones"
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