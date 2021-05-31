import {DkuGeoJson} from "./dku-geo-json.js";
import { InfoPopup } from './info-popup.js'
import { LOCATION_UNIQUE_KEY } from "../../dku-api.js";

const ZoneLayerGroup = {
    name: "zone-layer-group",
    props: {
        moduleName: String,
        zone: Object,
    },
    data() {
        return {
            componentKey: 0,
            locationUniqueKey: LOCATION_UNIQUE_KEY
        }
    },
    computed: {
        ...Vuex.mapGetters([
            'getZoneActiveIsochrones',
            'getIsochronesColorMapping'
        ])
    },
    components: {
        'l-feature-group': window.Vue2Leaflet.LFeatureGroup,
        'l-geo-json': window.Vue2Leaflet.LGeoJson,
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
        <l-feature-group ref="zoneLayerGroup" :key="componentKey">
            <l-marker :lat-lng="zone.latLng">
                <info-popup
                        :keyName="locationUniqueKey"
                        :keyValue="zone[locationUniqueKey].toString()"
                        :filteringFeatures="zone.filteringFeatures">
                </info-popup>
            </l-marker>
            <dku-geo-json v-for="iso in getZoneActiveIsochrones(zone.name, moduleName)"
                :key="iso.name"
                :zoneName="zone.name"
                :iso="iso"
                :color="getIsochroneColor(iso.name)"
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

export {ZoneLayerGroup}