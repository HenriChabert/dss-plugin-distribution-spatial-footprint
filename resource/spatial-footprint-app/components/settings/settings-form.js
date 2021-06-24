import { FilteringSection } from './filtering/filtering-section.js'
import { TabsHeader } from './tabs-header.js'
import {SamplingSection} from "./sampling/sampling-section.js";
import {PalettePicker} from "./options/palette-picker.js";
import {VToggle} from "../form/v-toggle.js";
import {PointsOfSalesTab} from "./points-of-sales-tab.js";
import {FiltersTab} from "./filters-tab.js";

const SettingsForm = {
    name: "settings-form",
    props: {
        moduleName: String,
        settingsModule: String,
        isVisible: Boolean
    },
    computed: {
        ...Vuex.mapGetters([
            'getLocations',
            'getCustomers'
        ]),
        getOptions() {
            return this.getModuleGetter('getOptions');
        },
        getActivatedTab() {
            return this.getModuleGetter("settings/getActivatedTab");
        },
        isCustomerModule() {
            return this.settingsModule === "customer";
        },
        activationToggleLabel() {
            return this.settingsModule === 'competitor' ? "Add competitor / other" : "Show customers";
        },
        showActivationToggle() {
            return this.settingsModule !== "basic";
        },
        showColorsPalette() {
            return !this.isCustomerModule;
        },
        identifierLabel() {
            return this.isCustomerModule ? "Customers" : "Point of sales";
        },
        getNumberItemsShowed() {
            return (this.isCustomerModule ? this.getCustomers : this.getLocations(this.settingsModule)).length;
        },
        getNumberItemsTotal() {
            return this.getModuleGetter("settings/getAvailableIdentifiers").length;
        }
    },
    methods: {
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
        toggleSettingsForm() {
            if (this.getOptions.isActivated) {
            this.$emit("update:moduleVisibility");
            }
        },
        setOption (optionName, e) {
            this.$store.commit(`${this.settingsModule}/setOption`, {optionName, optionValue: e});
        },
        toggle() {
            this.$store.commit(`${this.settingsModule}/${this.getOptions.isActivated ? "deactivate" : "activate"}`);
        },
        setActivatedTab(newActivatedTab) {
            if (this.getActivatedTab !== newActivatedTab){
                this.$store.commit(`${this.settingsModule}/settings/setActivatedTab`, {newActivatedTab});
            }
        }
    },
    components: {
        'filtering-section': FilteringSection,
        'sampling-section': SamplingSection,
        'palette-picker': PalettePicker,
        'v-toggle': VToggle,
        'tabs-header': TabsHeader,
        'points-of-sales-tab': PointsOfSalesTab,
        'filters-tab': FiltersTab
    },
    created () {
        this.$store.dispatch(`${this.settingsModule}/settings/fetchAvailableFilteringFeatures`, this.settingsModule);
        this.$store.dispatch(`${this.settingsModule}/settings/fetchAvailableIdentifiers`, this.settingsModule);
    },
    template: `
        <div id="settings-form">
            <div class="settings-form-header d-flex justify-content-between" v-on:click="toggleSettingsForm">
                <h4 class="d-flex align-items-center">
                    <div class="me-2">
                        <i v-if="isVisible" class="icon-sort-down"></i>
                        <i v-else class="icon-sort-up"></i>
                    </div>
                    {{ moduleName }}
                </h4>
                <span class="n-items-indicator-text" v-if="getOptions.isActivated">
                    {{ getNumberItemsShowed }}/{{ getNumberItemsTotal }} {{ identifierLabel }}
                </span>
                <div v-else class="ms-auto">
                    <v-toggle
                        :value="getOptions.isActivated"
                        @input="toggle()"
                        class="ms-3"></v-toggle>
                </div>
            </div>
            <div class="settings-form-body container" v-show="isVisible">
                <div v-if="showActivationToggle && getOptions.isActivated" class="d-flex mb-3">
                    <label>{{ activationToggleLabel }}</label>
                    <v-toggle
                        :value="getOptions.isActivated"
                        @input="toggle()"
                        class="ms-3"></v-toggle>
                </div>
                <div v-show="getOptions.isActivated" class="p-4">
                    <div class="tabs-section">
                        <tabs-header
                            :settingsModule="settingsModule"
                            :activatedTab="getActivatedTab"
                            :onlyFilters="isCustomerModule"
                            v-on:update:activatedTab="setActivatedTab($event)" class="mb-3"></tabs-header>
                        <points-of-sales-tab v-if="!isCustomerModule" v-show="getActivatedTab === 'individuals'"
                            :settingsModule="settingsModule"></points-of-sales-tab>
                        <filters-tab v-show="getActivatedTab === 'filters'"
                            :settingsModule="settingsModule"></filters-tab>
                    </div>
                    <sampling-section
                        :settingsModule="settingsModule"
                        class="my-3">
                    </sampling-section>
                    <div v-if="showColorsPalette" class="mb-3">
                        <palette-picker :settingsModule="settingsModule"></palette-picker>
                    </div>
                </div>
                
            </div>
        </div>`,
};

export {SettingsForm}