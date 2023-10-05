<script>
export default {
    emits: ['doLogin', 'doGoogleLogin'],
    data() {
        return {
            inputLogin: {
                email: '',
                password: ''
            }
        }
    },
    methods: {
        doLogin() {
            this.$emit('doLogin', this.inputLogin)
        },
        doGoogleLogin(response) {
            this.$emit('doGoogleLogin', response)
        }
    }
}
</script>

<template>
    <section id="login-section">
      <div class="login-container">
          <h2>Login</h2>
          <form @submit.prevent="doLogin">
              <input v-model="inputLogin.email" type="email" placeholder="Email" required>
              <input v-model="inputLogin.password" type="password" placeholder="Password" required>
              <button class="mb-2" type="submit" >Login</button>
          </form>
          <GoogleLogin :callback="doGoogleLogin"/>
      </div>
    </section>
</template>