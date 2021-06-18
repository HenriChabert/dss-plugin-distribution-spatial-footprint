const TabsHeader = {
    name: "tabs-header",
    props: {
        activatedTab: String
    },
    template: `
        <div>
            <div class="tabs-header d-flex align-items-center justify-content-center">
                <span 
                    :class="['tab-option', 'tab-left', activatedTab === 'points_of_sales' ? 'tab-activated' : '']"
                    v-on:click="$emit('update:activatedTab', 'points_of_sales')">From location</span>
                <span
                    :class="['tab-option', 'tab-right', activatedTab === 'filters' ? 'tab-activated' : '']"
                    v-on:click="$emit('update:activatedTab', 'filters')">From filters</span>
            </div>
        </div>`,
};

export {TabsHeader}