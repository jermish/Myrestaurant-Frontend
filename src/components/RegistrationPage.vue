<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh; background: #fff8f0">
    <v-card
      class="pa-6"
      max-width="500"
      elevation="3"
      style="background-color: #ffffff; border-radius: 16px"
    >
      <v-card-title class="text-h5 font-weight-bold text-center" style="color: #b34700">
        🍽️ Join Our Culinary Club
      </v-card-title>

      <v-card-subtitle class="text-center mb-4" style="color: #6e4f33">
        Get exclusive offers and delicious updates from our kitchen!
      </v-card-subtitle>

      <v-form ref="formRef" v-model="formValid" lazy-validation>
        <!-- First Name -->
        <v-text-field
          v-model="first"
          label="First Name"
          variant="outlined"
          color="brown"
          density="comfortable"
          :rules="[v => !!v || 'First name is required']"
        />


        
        <!-- Phone Number -->
        <v-text-field
          v-model="phone"
          label="Phone Number"
          variant="outlined"
          color="brown"
          density="comfortable"
          :rules="[v => !!v || 'Phone number is required']"
        />

        <!-- Email -->
        <v-text-field
          v-model="email"
          label="Email Address"
          variant="outlined"
          color="brown"
          density="comfortable"
          :rules="[
            v => !!v || 'Email is required',
            v => /.+@.+\..+/.test(v) || 'Invalid email'
          ]"
        />

        <!-- Password -->
        <v-text-field
          v-model="password"
          label="Create a Password"
          type="password"
          variant="outlined"
          color="brown"
          density="comfortable"
          :rules="[
            v => !!v || 'Password is required',
            v => v.length >= 6 || 'Minimum 6 characters'
          ]"
        />

              <!-- confirm  Password -->
              <v-text-field
              v-model="confirmpassword"
              label="Confirm Password"
              type="password"
              variant="outlined"
              color="brown"
              density="comfortable"
              :rules="[
                v => !!v || 'Confirm Password is required',
                v => v.length >= 6 || 'Minimum 6 characters',
                v => v === password.value || 'Passwords must match'
              ]"
            />


        <!-- Terms Checkbox -->
        <v-checkbox
          v-model="terms"
          color="orange-darken-2"
          label="I agree to receive emails from the restaurant"
          :rules="[v => v || 'You must agree to continue']"
        />

        <!-- Submit Button -->
        <v-btn
          block
          color="deep-orange-darken-2"
          class="mt-2"
          size="large"
          @click="register"
        >
          Register
        </v-btn>
      </v-form>

      <v-card-text class="text-center">
<p> Already have an account?
<router-link to="/logpage"> Sign in now <v-icon icon="mdi-chevron-right"></v-icon></router-link>
</p>
</v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

// Form state
const first = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const terms = ref(false)
const formValid = ref(false)
const formRef = ref(null)

// Register function
const register = async () => {
  if (formRef.value?.validate()) {
    try {
      const response = await fetch('http://localhost:8448/api/userdatas/adduser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: first.value,
          phonenumber: phone.value,
          email: email.value,
          password: password.value,
          
        }),
      })

      if (response.ok) {
        alert(`Welcome to the club, ${first.value}`)
        formRef.value.reset()
        // Reset values manually
        first.value = ''
        phone.value = ''
        email.value = ''
        password.value = ''
        terms.value = false
      } else {
        const errorData = await response.text()
        alert(`Registration failed: ${errorData}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again later.')
    }
  }
}
</script>
