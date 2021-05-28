import { FilteringSection } from './filtering/filtering-section.js'
import { OptionsSection } from "./options/options-section.js";
import { DKUApi } from '../../dku-api.js'
import {SamplingSection} from "./sampling/sampling-section.js";

const SettingsForm = {
    name: "settings-form",
    data() {
        return {
            isDropped: this.settingsModule !== 'location'
        };
    },
    props: {
        moduleName: String,
        settingsModule: String
    },
    methods: {
        toggleSettingsForm() {
            this.isDropped = !this.isDropped;
        },
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
    },
    computed: {
        getOptions() {
            return this.getModuleGetter('getOptions');
        }
    },
    components: {
        'filtering-section': FilteringSection,
        'sampling-section': SamplingSection,
        'options-section': OptionsSection,
    },
    created () {
        this.$store.dispatch(`${this.settingsModule}/settings/fetchAvailableFilteringFeatures`, this.settingsModule);
    },
    template: `
        <div id="settings-form">
            <div class="settings-form-header" v-on:click="toggleSettingsForm">
                <h4 class="d-flex align-items-center">
                    <div class="mr-2">
                        <i v-if="!isDropped" class="fas fa-sort-down"></i>
                        <i v-else class="fas fa-sort-up"></i>
                    </div>
                    {{ moduleName }}
                </h4>
            </div>
            <div class="settings-form-body container" v-show="!isDropped">
                <options-section :settingsModule="settingsModule"></options-section>
                <filtering-section v-show="getOptions.isActivated"
                :settingsModule="settingsModule"></filtering-section>
                <sampling-section v-show="getOptions.isActivated"
                :settingsModule="settingsModule"></sampling-section>
            </div>
        </div>`,
};

export {SettingsForm}