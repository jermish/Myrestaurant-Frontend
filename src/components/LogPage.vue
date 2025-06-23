<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card elevation="8" rounded="lg">
          <v-card-title class="text-center pa-6">
            <v-icon size="48" color="primary" class="mb-2">mdi-account-circle</v-icon>
            <h2 class="text-h4 font-weight-bold">Welcome Back</h2>
            <p class="text-subtitle-1 text-medium-emphasis mt-2">
              Sign in to your account
            </p>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form ref="loginForm" v-model="valid" @submit.prevent="submit">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                class="mb-3"
                :error-messages="emailError"
                @input="clearErrors"
              />

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                variant="outlined"
                class="mb-3"
                :error-messages="passwordError"
                @click:append-inner="showPassword = !showPassword"
                @input="clearErrors"
              />

              <v-row class="mb-4">
                <v-col cols="6">
                  <v-checkbox
                    v-model="rememberMe"
                    label="Remember me"
                    density="compact"
                    hide-details
                  />
                </v-col>
                <v-col cols="6" class="text-right">
                  <v-btn
                    variant="text"
                    size="small"
                    color="primary"
                    @click="handleForgotPassword"
                  >
                    Forgot Password?
                  </v-btn>
                </v-col>
              </v-row>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="!valid"
                class="mb-4"
              >
                Sign In
              </v-btn>

              <v-divider class="my-4">
                <span class="text-medium-emphasis px-3">or</span>
              </v-divider>

              <v-btn
                variant="outlined"
                size="large"
                block
                prepend-icon="mdi-google"
                @click="handleGoogleLogin"
                class="mb-3"
              >
                Continue with Google
              </v-btn>

              <v-btn
                variant="outlined"
                size="large"
                block
                prepend-icon="mdi-github"
                @click="handleGithubLogin"
              >
                Continue with GitHub
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="successSnackbar"
      color="success"
      timeout="3000"
      location="top"
    >
      {{ successMessage }}
      <template #actions>
        <v-btn variant="text" @click="successSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="errorSnackbar"
      color="error"
      timeout="5000"
      location="top"
    >
      {{ errorMessage }}
      <template #actions>
        <v-btn variant="text" @click="errorSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LoginComponent',
  data() {
    return {
      valid: false,
      loading: false,
      showPassword: false,
      rememberMe: false,
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      successSnackbar: false,
      errorSnackbar: false,
      successMessage: '',
      errorMessage: '',
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
      ]
    }
  },
  methods: {
    async submit() {
      if (!this.valid) return

      this.loading = true
      this.clearErrors()

      const payload = {
        email: this.email,
        password: this.password
      }

      try {
        // Assuming your Vuex login action returns the role directly
        const role = await this.$store.dispatch('login', payload)

        if (role) {
          this.successMessage = 'Login successful! Redirecting...'
          this.successSnackbar = true

          setTimeout(() => {
            if (role === 'admin') {
              console.log('Admin login initiated role:',role);
              this.$router.push('/adminhomepage')
             
            } else if (role === 'outlet') {
              console.log('outlet login initiated role:,role');
              this.$router.push('/outlethomepage')
            } else {
              console.log('user login initiated role:',role);
              this.$router.push('/userhomepage')
            }
          }, 1000)
        } else {
          this.errorMessage = 'Login failed. Please try again.'
          this.errorSnackbar = true
        }
      } catch (error) {
        this.errorMessage = 'Invalid login details.'
        this.errorSnackbar = true
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    async handleGoogleLogin() {
      try {
        this.loading = true
        await this.simulateApiCall()
        this.successMessage = 'Google login successful!'
        this.successSnackbar = true
        console.log('Google login initiated')
      } catch (error) {
        this.errorMessage = 'Google login failed. Please try again.'
        this.errorSnackbar = true
      } finally {
        this.loading = false
      }
    },

    async handleGithubLogin() {
      try {
        this.loading = true
        await this.simulateApiCall()
        this.successMessage = 'GitHub login successful!'
        this.successSnackbar = true
        console.log('GitHub login initiated')
      } catch (error) {
        this.errorMessage = 'GitHub login failed. Please try again.'
        this.errorSnackbar = true
      } finally {
        this.loading = false
      }
    },

    handleForgotPassword() {
      console.log('Forgot password clicked')
      this.successMessage = 'Password reset link sent to your email!'
      this.successSnackbar = true
    },

    clearErrors() {
      this.emailError = ''
      this.passwordError = ''
    },

    simulateApiCall() {
      return new Promise(resolve => setTimeout(resolve, 1000))
    },

    resetForm() {
      this.$refs.loginForm?.reset()
      this.email = ''
      this.password = ''
      this.rememberMe = false
      this.clearErrors()
    }
  },
  computed: {
    ...mapGetters(['getRole']),
    Role() {
      return this.getRole
    }
  }
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.v-card {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.95) !important;
}

.v-btn {
  text-transform: none;
  font-weight: 500;
}

.v-text-field {
  margin-bottom: 8px;
}

.text-medium-emphasis {
  opacity: 0.7;
}
</style>
