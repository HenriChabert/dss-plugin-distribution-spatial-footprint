import {DkuGeoJson} from "./dku-geo-json.js";
import { InfoPopup } from './info-popup.js'

const LocationLayerGroup = {
    name: "location-layer-group",
    props: {
        moduleName: String,
        location: Object,
    },
    data() {
        return {
            componentKey: 0
        }
    },
    computed: {
        ...Vuex.mapGetters([
            'getLocationActiveIsochrones',
            'getIsochronesColorMapping'
        ]),
        markerUrl() {
            const baseUrl = "../../resource/spatial-footprint-app/img/";
            const pin = `${baseUrl}/marker-icon-${this.moduleName === "competitor" ? "red" : "blue"}-2x.png`;
            const shadow = "../../resource/spatial-footprint-app/libs/leaflet/images/marker-shadow.png";
            return { pin, shadow }
        },
    },
    components: {
        'l-feature-group': window.Vue2Leaflet.LFeatureGroup,
        'l-geo-json': window.Vue2Leaflet.LGeoJson,
        'l-icon': window.Vue2Leaflet.LIcon,
        'l-marker': window.Vue2Leaflet.LMarker,
        'info-popup': InfoPopup,
        'dku-geo-json': DkuGeoJson,
    },
    methods: {
        getIsochroneColor(isoName) {
            return this.getIsochronesColorMapping(this.moduleName)[isoName];
        },
        forceRerender() {
            this.componentKey += 1;
        },
    },
    template:`
        <l-feature-group ref="locationLayerGroup" :key="componentKey">
            <l-marker :lat-lng="[location.latitude, location.longitude]">
                <l-icon
                    :icon-url="markerUrl.pin"
                    :shadow-url="markerUrl.shadow"
                />
                <info-popup
                        :filteringFeatures="location.filteringFeatures">
                </info-popup>
            </l-marker>
            <dku-geo-json v-for="iso in getLocationActiveIsochrones(location.location_UUid, moduleName)"
                :key="iso.isochrone_id"
                :locationName="location.id.toString()"
                :iso="iso"
                :color="getIsochroneColor(iso.isochrone_type)"
            >
            </dku-geo-json>
        </l-feature-group>
    `, // Hack for rerender here: https://michaelnthiessen.com/key-changing-technique/
    created() {
        this.unsubscribe = this.$store.subscribe((mutation, state) => {
            if (mutation.type.match(/(.*)\/setOption/) || mutation.type === 'setActiveIsochrones') {
                this.forceRerender();
            }
        });
    },
    beforeDestroy() {
        this.unsubscribe();
    },
}

export {LocationLayerGroup}