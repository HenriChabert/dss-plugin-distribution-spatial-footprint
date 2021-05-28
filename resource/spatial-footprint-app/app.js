import {MapContainer} from "./components/map-container.js"
import {ErrorsComponent} from "./components/errors.js"
import store from "./state/index.js"

Vue.use(Vuex)

export default new Vue({
    el: '#app',
    store,
    components: {
        'errors': ErrorsComponent,
        'map-container': MapContainer,
    },
    template:`
        <div class="main">
            <errors></errors>
            <map-container></map-container>
        </div>
    `
})