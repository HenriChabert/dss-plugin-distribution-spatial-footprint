const InfoPopup = {
    name: "info-popup",
    props: {
        id: String,
        filteringFeatures: Object,
        moduleName: String
    },
    components: {
        'l-popup': window.Vue2Leaflet.LPopup,
    },
    computed: {
        ...Vuex.mapGetters([
            'getLocations',
        ]),
        isCustomer() {
            return this.moduleName === "customer";
        },
        iconPath() {
            return `../../resource/spatial-footprint-app/img/${this.isCustomer ? "user" : "custom-marker"}.png`
        }
    },
    methods: {
        setActivatedTab(newActivatedTab) {
            if (this.getActivatedTab !== newActivatedTab){
                this.$store.commit(`${this.moduleName}/settings/setActivatedTab`, { newActivatedTab });
            }
        },
        updateFiltersForID(newFilters) {
            this.$store.commit(
                `${this.moduleName}/settings/setFilteringFeature`, {
                    featureName: "id",
                    filters: newFilters
                }
            );
        },
        unselect() {
            const selectedLocations = this.getLocations(this.moduleName).map((loc) => loc.id);
            this.updateFiltersForID(selectedLocations.filter((loc) => loc !== this.id));
            this.setActivatedTab("individuals");
        },
        focus() {
            this.updateFiltersForID([this.id]);
            this.setActivatedTab("individuals");
        }
    },
    template: `
        <l-popup>
            <h5 class="mb-3 d-flex align-items-center">
                <img :src="iconPath" alt="custom marker" class="me-2"/>
                <b>{{ id }}</b>
            </h5>
            <ul class="popup-list">
                <li v-for="(featureValue, featureName) in filteringFeatures" :key="featureName">
                    <span><b>{{ featureName }}</b>: {{ featureValue }}</span>
                </li>
            </ul>
            <div class="popup-actions d-flex align-items-center justify-content-around" v-if="!isCustomer">
                <a href="javascript:void(0);" class="action-btn" @click="unselect"><b>unselect</b></a>
                <a href="javascript:void(0);" class="action-btn" @click="focus"><b>focus (unselect others)</b></a>
            </div>
        </l-popup>
        `
};

export {InfoPopup}
