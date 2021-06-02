import {MapContainer} from "./components/map-container.js"
import {ErrorsComponent} from "./components/errors.js"
import { DKUApi } from './dku-api.js'
import store from "./state/index.js"

Vue.use(Vuex)

export default new Vue({
    el: '#app',
    store,
    components: {
        'errors': ErrorsComponent,
        'map-container': MapContainer,
    },
    data() {
        return {
            isReady: false
        }
    },
    mounted() {
        DKUApi.isServerRunning()
            .then((result) => {
                this.isReady = true
            })
            .catch((err) =>{
                console.error("The backend is not running. Please launch it and try again.")
            })
    },
    template:`
        <div class="main">
            <errors></errors>
            <map-container v-if="isReady"></map-container>
        </div>
    `
})