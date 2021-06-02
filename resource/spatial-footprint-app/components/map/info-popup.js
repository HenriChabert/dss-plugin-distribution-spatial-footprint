const InfoPopup = {
    name: "info-popup",
    props: {
        filteringFeatures: Object
    },
    components: {
        'l-popup': window.Vue2Leaflet.LPopup,
    },
    template: `
        <l-popup>
            <ul class="popup-list">
                <li v-for="(featureValue, featureName) in filteringFeatures" :key="featureName">
                    <span>{{ featureName }}: {{ featureValue }}</span>
                </li>
            </ul>
        </l-popup>
        `
};

export {InfoPopup}
