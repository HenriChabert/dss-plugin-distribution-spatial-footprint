import { SettingsForm } from './settings-form.js'

const SettingsPanel = {
    name: "settings-panel",
    components: {
        'settings-form': SettingsForm,
        'v-select': VueSelect.VueSelect,
    },
    computed: {
        ...Vuex.mapGetters([
            'getIsochronesTypes',
            'getActiveIsochrones'
        ])
    },
    data() {
        return {
            isDropped: false
        };
    },
    methods: {
        toggleSettingsPanel() {
           this.isDropped = !this.isDropped;
        },
        setActiveIsochrones(activeIsochrones) {
            this.$store.commit("setActiveIsochrones", { activeIsochrones });
        },
    },
    mounted() {
        this.setActiveIsochrones(this.getIsochronesTypes)
    },
    created () {
        this.$store.dispatch('fetchIsochronesTypes');
    },
    template: `
        <div class="settings-panel-container container d-flex flex-column">
            <div class="settings-panel-header mt-2 d-flex justify-content-between" v-on:click="toggleSettingsPanel">
                <h3 class="settings-panel-title">Settings</h3>
                <div>
                    <i v-if="!isDropped" class="icon-chevron-down"></i>
                    <i v-else class="icon-chevron-up"></i>
                </div>
            </div>
            <div class="settings-panel" v-show="!isDropped"">
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
                <hr>
                <settings-form
                    settingsModule="location"
                    moduleName="Network Analysis">
                </settings-form>
                <hr>
                <settings-form
                    settingsModule="competitor"
                    moduleName="Comparative Network Analysis">
                </settings-form>
                <hr>
                <settings-form
                    settingsModule="customer"
                    moduleName="Customer Analysis">
                </settings-form>
            </div>
        </div>`,
};

export {SettingsPanel}