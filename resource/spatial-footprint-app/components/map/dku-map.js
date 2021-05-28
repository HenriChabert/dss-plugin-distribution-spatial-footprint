import { DKUApi } from '../../dku-api.js'
import { DkuGeoJson } from "./dku-geo-json.js";
import { ZoneLayerGroup } from "./zone-layer-group.js";
import {CustomerPane} from "./customer-pane.js";

const DkuMap = {
    name: "dku-map",
    computed: {
        ...Vuex.mapGetters([
            'getZones',
            'getCustomers',
            'getActiveIsochrones',
            'zoom',
            'tileLayerUrl',
            'showCompetitor',
            'showCustomers'
        ]),
    },
    data() {
        return {
            bounds: this.bounds || [[46, 48], [2, 4]]
        }
    },
    components: {
        'l-map': window.Vue2Leaflet.LMap,
        'l-tile-layer': window.Vue2Leaflet.LTileLayer,
        'l-control-zoom': window.Vue2Leaflet.LControlZoom,
        'l-feature-group': window.Vue2Leaflet.LFeatureGroup,
        'dku-geo-json': DkuGeoJson,
        'zone-layer-group': ZoneLayerGroup,
        'customer-pane': CustomerPane
    },
    methods: {
        updateZones(newZones) {
            this.$store.commit('updateZones', newZones);
        }
    },
    mounted() {
        this.unsubscribe = this.$store.subscribe((mutation, state) => {
            const matching_items = mutation.type.match(/(.*)\/settings\/(.*)/);
            if (matching_items) {
                this.$store.dispatch('getFilteredZones', matching_items[1]);
                this.$store.dispatch('getFilteredCustomers');
                this.$nextTick(function () {
                    this.bounds = this.$refs.features.mapObject.getBounds();
                })
            }
        });
    },
    template:`
        <l-map id="dku-map"
            ref="map"
            :bounds="bounds"
            :options="{zoomControl: false}">
            <l-tile-layer :url="tileLayerUrl"></l-tile-layer>
            <l-control-zoom position="bottomright"></l-control-zoom>
            <l-feature-group ref="features">
                <zone-layer-group v-for="zone in getZones('location')"
                    :key="zone.name"
                    :zone="zone"
                    moduleName="location"></zone-layer-group>
                <zone-layer-group v-if="showCompetitor"
                    v-for="zone in getZones('competitor')"
                    :key="zone.name + '_competitor'" 
                    :zone="zone"
                    moduleName="competitor"></zone-layer-group>
                <customer-pane v-if="showCustomers"
                    :customers="getCustomers"
                    :activeIsochrones="getActiveIsochrones"
                    ></customer-pane>
            </l-feature-group>
        </l-map>
    `,
    beforeDestroy() {
        this.unsubscribe();
    },
}
export {DkuMap}