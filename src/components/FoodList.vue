<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar fixed color="white" elevation="2">
      <v-container class="d-flex align-center">
        <!-- Company Name -->
        <v-app-bar-title class="text-h4 font-weight-bold text-amber-darken-2">
          <i class="fas fa-utensils mr-2"></i>
          Adam Grills
        </v-app-bar-title>

        <!-- Category Dropdown -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="ml-4">
              Categories
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="selectedCategory = null">
              <v-list-item-title>All Categories</v-list-item-title>
            </v-list-item>
            <v-list-item v-for="category in categories" :key="category.catId" @click="filterByCategory(category)">
              <v-list-item-title>{{ category.catName }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Search Bar -->
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Search menu items..."
          single-line
          hide-details
          class="ml-4"
          style="max-width: 300px"
        ></v-text-field>

        <v-spacer></v-spacer>

        <!-- Order Details -->
        <v-btn class="mr-4" prepend-icon="mdi-cart">
          Orders
          <v-badge
            v-if="orderCount > 0"
            :content="orderCount"
            color="amber-darken-2"
            offset-x="-8"
            offset-y="8"
          ></v-badge>
        </v-btn>

        <!-- Profile Menu -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="amber-accent-3" size="40">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="openProfile">
              <v-list-item-title>
                <v-icon start>mdi-account-edit</v-icon>
                Edit Profile
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="openOrderHistory">
              <v-list-item-title>
                <v-icon start>mdi-history</v-icon>
                Order History
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>
                <v-icon start>mdi-logout</v-icon>
                Logout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="pt-16">
      <v-container class="py-16">
        <div class="text-center mb-12 fade-in">
          <h2 class="text-h2 font-weight-bold text-amber-darken-2 mb-4">Our Menu</h2>
          <p class="text-h6 text-grey-darken-1">Explore our delicious offerings by category</p>
        </div>

        <div v-for="category in filteredCategories" :key="category.catId" class="mb-16">
          <h3 class="text-h3 font-weight-bold text-amber-darken-2 mb-8">{{ category.catName }}</h3>
          <v-row>
            <v-col v-for="food in getFoodsByCategory(category.catId)" :key="food.foodId" cols="12" md="4">
              <v-card class="menu-item-card floating-card h-100" elevation="8" @click="showFoodDetails(food)">
                <v-img
                  :src="'data:image/jpeg;base64,' + food.foodImage"
                  height="250"
                  contain
                  class="bg-grey-lighten-2"
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon size="80" color="amber-darken-2">mdi-food</v-icon>
                    </div>
                  </template>
                </v-img>
                <v-card-title class="text-h5 font-weight-bold text-amber-darken-2">{{ food.foodName }}</v-card-title>
                <v-card-text>
                  <div class="d-flex justify-space-between align-center">
                    <span class="text-h5 font-weight-bold text-amber-darken-2">₹{{ food.price }}</span>
                    <v-spacer></v-spacer>
                    <v-btn class="order-btn" elevation="0" @click.stop="buyNow(food)">ORDER</v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Food Details Dialog -->
        <v-dialog v-model="foodDialog" max-width="500px">
          <v-card v-if="selectedFood">
            <v-card-title class="d-flex pa-4">
              <div class="d-flex align-center">
                <v-img
                  :src="'data:image/jpeg;base64,' + selectedFood.foodImage"
                  width="100"
                  height="100"
                  class="rounded-lg mr-4"
                  contain
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon size="40" color="amber-darken-2">mdi-food</v-icon>
                    </div>
                  </template>
                </v-img>
                <div>
                  <h3 class="text-h5 font-weight-bold text-amber-darken-2 mb-1">{{ selectedFood.foodName }}</h3>
                  <div class="text-h6 text-amber-darken-2">₹{{ selectedFood.price }}</div>
                </div>
              </div>
            </v-card-title>

            <v-card-text class="pt-2 pb-4">
              <v-divider class="mb-4"></v-divider>

              <div class="text-subtitle-1 font-weight-bold mb-2">Description</div>
              <p class="text-body-1 text-grey-darken-2 mb-4">{{ selectedFood.foodDescription }}</p>

              <div class="text-subtitle-1 font-weight-bold mb-2">Category</div>
              <p class="text-body-1 text-grey-darken-2 mb-4">
                {{ categories.find(cat => cat.catId === selectedFood.catId)?.catName }}
              </p>

              <v-btn class="order-btn mt-4" block elevation="2" height="44" @click="buyNow(selectedFood)">
                ORDER NOW
              </v-btn>
            </v-card-text>

            <v-card-actions class="pa-4 pt-0">
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="foodDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>

    <v-footer class="contact-section py-16">
      <v-container>
        <div class="text-center mb-12 fade-in">
          <h2 class="text-h2 font-weight-bold text-amber-accent-3 mb-4">Visit Us Today</h2>
          <p class="text-h6 text-grey-lighten-2">Experience the finest dining in the heart of the city</p>
        </div>

        <v-row>
          <v-col cols="12" md="4" class="text-center" v-for="contact in contactInfo" :key="contact.title">
            <div class="fade-in">
              <v-avatar size="80" class="mb-4 bg-amber-accent-3">
                <v-icon size="40" color="black">{{ contact.icon }}</v-icon>
              </v-avatar>
              <h3 class="text-h5 font-weight-bold text-amber-accent-3 mb-2">{{ contact.title }}</h3>
              <p class="text-body-1 text-grey-lighten-1">{{ contact.info }}</p>
            </div>
          </v-col>
        </v-row>

        <div class="text-center mt-12">
          <v-btn class="reservation-btn pulse-animation" size="x-large" @click="openReservation">
            <i class="fas fa-phone mr-2"></i>
            Call for Reservations
          </v-btn>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FoodList',
  data() {
    return {
      foodDialog: false,
      selectedFood: null,
      searchQuery: '',
      selectedCategory: null,
      orderCount: 0,
      contactInfo: [
        { title: 'Location', info: '123 Gourmet Street, Culinary District, City 12345', icon: 'mdi-map-marker' },
        { title: 'Phone', info: '+1 (555) 123-4567', icon: 'mdi-phone' },
        { title: 'Hours', info: 'Mon-Thu: 5PM-10PM\nFri-Sat: 5PM-11PM\nSun: Closed', icon: 'mdi-clock' }
      ]
    }
  },
  computed: {
    ...mapGetters('outlet', ['categories', 'foods']),
    filteredCategories() {
      return this.selectedCategory ? [this.selectedCategory] : this.categories
    },
    getFoodsByCategory() {
      return (catId) => {
        return this.foods.filter(
          (food) => food.catId === catId && food.foodName.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    filterByCategory(category) {
      this.selectedCategory = category
    },
    openProfile() {},
    openOrderHistory() {},
    logout() {},
    buyNow(item) {
      console.log('Buying item:', item)
      this.orderCount++
      this.foodDialog = false
    },
    async loadData() {
      try {
        await this.$store.dispatch('outlet/fetchCategories')
        await this.$store.dispatch('outlet/fetchFoods')
      } catch (error) {
        console.error('Error loading data:', error)
      }
    },
    showFoodDetails(food) {
      this.selectedFood = food
      this.foodDialog = true
    },
    openReservation() {
      console.log('Reservation clicked')
    }
  }
}
</script>

<style scoped>
.v-app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-main {
  background-color: #f5f5f5;
}

.floating-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.floating-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.menu-item-card {
  background: linear-gradient(135deg, #fff 0%, #fafafa 100%);
  border-left: 4px solid #d4af37;
  transition: all 0.3s ease;
}

.menu-item-card:hover {
  border-left-color: #b8860b;
  transform: scale(1.02);
}

.fade-in {
  animation: fadeIn 0.8s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-section {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  width: 100%;
}

.reservation-btn {
  background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
  color: white;
  border: none;
  transition: all 0.3s ease;
}

.order-btn {
  background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
  color: white;
  border: none;
}

.reservation-btn:hover {
  background: linear-gradient(135deg, #b8860b 0%, #daa520 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
}

.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.v-dialog .v-card {
  border-radius: 12px;
  overflow: hidden;
}

.v-dialog .rounded-lg {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
}

.v-dialog .order-btn {
  background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
  color: white;
  font-size: 1rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
</style>
