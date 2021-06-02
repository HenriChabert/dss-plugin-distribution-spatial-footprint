const InfoPopup = {
    name: "info-popup",
    props: {
        filteringFeatures: Object
    },
    computed: {
        getOrderedFilteringFeatures() {
            const { location_identifier, ...otherFilteringFeatures } = this.filteringFeatures;
            return location_identifier ? { location_identifier, ...otherFilteringFeatures } : otherFilteringFeatures;

        }
    },
    components: {
        'l-popup': window.Vue2Leaflet.LPopup,
    },
    template: `
        <l-popup>
            <ul class="popup-list">
                <li v-for="(featureValue, featureName) in getOrderedFilteringFeatures" :key="featureName">
                    <span>{{ featureName }}: {{ featureValue }}</span>
                </li>
            </ul>
        </l-popup>
        `
};

export {InfoPopup}
