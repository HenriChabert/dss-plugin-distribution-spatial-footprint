import { DKUApi } from '../../dku-api.js'
import { DkuGeoJson } from "./dku-geo-json.js";
import { ZoneLayerGroup } from "./zone-layer-group.js";
import {CustomerPane} from "./customer-pane.js";

const DEFAULT_BOUNDS = [[20.63698621180491, -52.20703125000001], [65.80461669092902, 74.35546875000001]]

const DkuMap = {
    name: "dku-map",
    computed: {
        ...Vuex.mapGetters([
            'getZones',
            'getCustomers',
            'getActiveIsochrones',
            'tileLayerUrl',
            'showCompetitor',
            'showCustomers'
        ]),
    },
    data() {
        return {
            bounds: DEFAULT_BOUNDS
        }
    },
    components: {
        'l-map': window.Vue2Leaflet.LMap,
        'l-tile-layer': window.Vue2Leaflet.LTileLayer,
        'l-control-zoom': window.Vue2Leaflet.LControlZoom,
        'l-feature-group': window.Vue2Leaflet.LFeatureGroup,
        'l-control': window.Vue2Leaflet.LControl,
        'dku-geo-json': DkuGeoJson,
        'zone-layer-group': ZoneLayerGroup,
        'customer-pane': CustomerPane
    },
    methods: {
        updateZones(newZones) {
            this.$store.commit('updateZones', newZones);
        },
        fitBounds() {
            if (this.$refs.features.mapObject.getLayers().length) {
                this.bounds = this.$refs.features.mapObject.getBounds();
                this.$refs.map.mapObject.fitBounds(this.bounds);
            }
        }
    },
    mounted() {
        this.unsubscribe = this.$store.subscribe((mutation, state) => {
            const location_updated = mutation.type.match(/(location|competitor)\/settings\/(.*)/);
            if (location_updated) {
                this.$store.dispatch('getFilteredZones', location_updated[1]);
                this.$store.dispatch('getFilteredCustomers');
            }

            if (mutation.type.match(/customer\/settings\/(.*)/)) {
                this.$store.dispatch('getFilteredCustomers');
            }

            if (mutation.type.match(/(updateZones|updateCustomers)/)) {
                this.$nextTick(function () {
                    debugger;
                    this.fitBounds()
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
            <l-control class="leaflet-control-zoom leaflet-bar leaflet-control" position="bottomright" >
                <a href="#" title="Auto scale" role="button" aria-label="Auto scale"><i class="icon-move" @click="fitBounds"></i></a>
            </l-control>
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