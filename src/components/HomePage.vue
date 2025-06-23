<template>
    <v-app-bar app color="dark" dark>
      <v-container class="d-flex align-center">
        <v-icon class="mr-2">mdi-silverware-fork-knife</v-icon>
        <v-toolbar-title class="font-weight-bold text-orange">Restoran</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text to="/">Home</v-btn>
        <v-btn text to="/about">About</v-btn>
        <v-btn text to="/service">Service</v-btn>
        <v-btn text to="/menu">Menu</v-btn>
        <v-btn text to="/contact">Contact</v-btn>
        <v-btn class="ml-4" color="orange" dark>Book a Table</v-btn>
      </v-container>
    </v-app-bar>
  </template>


  <script>
  export default {
    name: "Navbar",
  };
  </script>
  