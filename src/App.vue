<template>
  <v-app>
    <v-main>
      <!-- <login-page></login-page> -->
       <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import LoginPage from './components/LoginPage.vue'

export default {
  name: 'App',

  components: {
    // HelloWorld,c
    // LoginPage,
  },

  data: () => ({
    //
  }),
}
</script>
