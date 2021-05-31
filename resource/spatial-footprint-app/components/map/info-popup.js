const InfoPopup = {
    name: "info-popup",
    props: {
        keyName: String,
        keyValue: String,
        filteringFeatures: Object
    },
    components: {
        'l-popup': window.Vue2Leaflet.LPopup,
    },
    template: `
        <l-popup>
            <i class="icon-key mr-2"></i><span>{{ keyName }}: {{ keyValue }}</span>
            <hr>
            <ul class="popup-list">
                <li v-for="(featureValue, featureName) in filteringFeatures" :key="featureName">
                    <span>{{ featureName }}: {{ featureValue }}</span>
                </li>
            </ul>
        </l-popup>
        `
};

export {InfoPopup}
