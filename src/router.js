import { createRouter,createWebHistory } from "vue-router";

const router=createRouter({
    history:createWebHistory(),
    routes:[

        {
            path:"/",
            component:()=>import('./components/LoginPage.vue')    
        },
        {
            path:'/reg',
            component:()=>import('./components/RegistrationPage.vue')
        },

        {
            path:'/outlethomepage',
            component:()=>import('./components/OutLet.vue')
        },
        {
            path:'/adminhomepage',
            component:()=>import('./components/AdminPage.vue')
        },
        {
            path:'/deliverypage',
            component:()=>import('./components/DeliveryBoy.vue')
        },
        {
            path:'/userhomepage',
            component:()=>import('./components/RestUser.vue')
        },
        {
            path:'/listfooditems',
            component:()=>import('./components/FoodList.vue')
        },
        {
            path:'/addFoodItem',
            component:()=>import('./components/AddFoodItems.vue')
        },
        {
            path:'/updateFood',
            component:()=>import('./components/UpdateFoodItem.vue')
        },
        {
            path:'/logpage',
            component:()=>import('./components/LogPage.vue')
        },
        {
            path:'/add-deliveryboy',
            component:()=>import('./components/AddDeliveryPerson.vue')
        },
       

    ]
});
export default router;