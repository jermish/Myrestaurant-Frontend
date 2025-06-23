<template>
  <v-app>
    <!-- Navbar -->
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
        <v-btn class="ml-4" color="orange" dark to="/reg">Sign Up</v-btn>
      </v-container>
    </v-app-bar>

    <!-- Hero Section -->
    <v-container fluid class="hero-section d-flex align-center justify-center">
      <div class="login-part text-center">
        <h1>Enjoy Our Delicious Meal</h1>
        <p>Experience the best grilled delights with fresh ingredients and amazing flavors.</p>
<!--<v-btn color="orange" dark class="mt-3 login-btn">Login</v-btn>-->
      </div>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "NavbarHeroSection",
};
</script>

<style scoped>
.hero-section {
  background: url('../assets/bg page.jpg') no-repeat center center;
  background-size: cover;
  height: 100vh;
}

.login-part {
  max-width: 900px;
  /* background-color: rgba(0, 0, 0, 0.6);  */
  padding: 40px;
  /* border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5); */
  color: white;
/* Precise position: shifted to right and down */
  transform: translate(200px, 100px);

  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.login-part:hover {
  transform: translate(200px, 100px) scale(1.02);
  /* box-shadow: 0 12px 24px rgba(0, 0, 0, 0.7); */
}

.login-part h1 {
  font-size: 4.5rem;
  font-weight: bold;
  margin-bottom: 30px;
}

.login-part p {
  font-size: 2rem;
  margin-bottom: 30px;
}

.login-btn {
  font-size: 1.5rem;
  padding: 16px 32px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.login-btn:hover {
  background-color: #ff9800;
  transform: scale(1.05);
}
</style>
