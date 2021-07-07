import {MapContainer} from "./components/map-container.js"
import {ErrorsComponent} from "./components/errors.js"
import store from "./state/index.js"
import {APIErrors} from "./dku-api.js";

Vue.use(Vuex)

// Hack found here: https://github.com/sagalbot/vue-select/issues/1311
Vue.component('v-select', {
  extends: VueSelect.VueSelect,
  methods:{
      toggleDropdown(event) {
        const targetIsNotSearch = event.target !== this.searchEl;
        if (targetIsNotSearch) {
          event.preventDefault();
        }
        if (event.target.closest('.vs__deselect, .vs__clear')) {
          event.preventDefault();
          return;
        }
        if (this.open && targetIsNotSearch) {
          this.searchEl.blur();
        } else if (!this.disabled) {
          this.open = true;
          this.searchEl.focus();
        }
      }
  }
});

export default new Vue({
    el: '#app',
    store,
    components: {
        'errors': ErrorsComponent,
        'map-container': MapContainer,
    },
    computed: {
        isBackendRunning() {
            return dataiku.getWebAppBackendUrl('') !== "${backendUrlPrefix}/";
        }
    },
    mounted() {
        if (!this.isBackendRunning) {
            let newError = {
                statusText: "Backend not running",
                data: {
                    error: "This webapp requires a backend but it does not seem to be running "
                }

            }
            APIErrors.push(newError);
        }
    },
    template:`
        <div class="main">
            <errors></errors>
            <map-container v-if="isBackendRunning"></map-container>
        </div>
    `
})