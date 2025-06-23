// import { createStore } from 'vuex';
import actions from './actions.js';
import getters from './getters.js';
import mutations from './mutations.js';




export default {
    namespaced: true,
    state() {
        return {
            categories: [],
            foods: [],
            deliveryPersons: [],
            loading: false,
            error: null
          
           
        };
    },

    actions,
    mutations,
    getters
}