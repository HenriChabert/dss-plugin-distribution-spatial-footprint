const InfoPopup = {
    name: "info-popup",
    props: {
        id: String,
        filteringFeatures: Object
    },
    components: {
        'l-popup': window.Vue2Leaflet.LPopup,
    },
    template: `
        <l-popup>
            <ul class="popup-list">
                <li>Identifier: {{ id }}</li>
                <li v-for="(featureValue, featureName) in filteringFeatures" :key="featureName">
                    <span>{{ featureName }}: {{ featureValue }}</span>
                </li>
            </ul>
        </l-popup>
        `
};

export {InfoPopup}
