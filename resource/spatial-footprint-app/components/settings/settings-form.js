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
            <div class="settings-form-header mb-3" v-on:click="toggleSettingsForm">
                <h4 class="d-flex align-items-center">
                    <div class="mr-2">
                        <i v-if="!isDropped" class="icon-sort-down"></i>
                        <i v-else class="icon-sort-up"></i>
                    </div>
                    {{ moduleName }}
                </h4>
            </div>
            <div class="settings-form-body container" v-show="!isDropped">
                <options-section :settingsModule="settingsModule"
                class="mb-3"></options-section>
                <filtering-section v-show="getOptions.isActivated"
                :settingsModule="settingsModule"
                class="mb-3"></filtering-section>
                <sampling-section v-show="getOptions.isActivated"
                :settingsModule="settingsModule"
                class="mb-3"></sampling-section>
            </div>
        </div>`,
};

export {SettingsForm}