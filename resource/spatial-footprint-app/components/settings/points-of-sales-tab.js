import { FilteringFeature } from './filtering/filtering-feature.js'

const PointsOfSalesTab = {
    name: "settings-form",
    props: {
        settingsModule: String
    },
    computed: {
        identifierLabel() {
            return this.settingsModule === "customer" ? "Customer ID" : "Point of sales";
        },
        getAvailableIdentifiers() {
            return this.getModuleGetter('settings/getAvailableIdentifiers') || [];
        }
    },
    methods: {
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        }
    },
    components: {
        'filtering-feature': FilteringFeature,
    },
    template: `
        <div class="points-of-sales-tab">
            <filtering-feature
                name="id"
                :items="getAvailableIdentifiers"
                :label="identifierLabel"
                :showName="true"
                :settingsModule="settingsModule"
                :selectable="false"
                :isVisible="true">
            </filtering-feature>
        </div>`,
};

export {PointsOfSalesTab}