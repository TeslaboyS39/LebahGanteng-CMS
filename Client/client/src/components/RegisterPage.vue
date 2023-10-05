<script>
export default {
    emits: ['doRegister', 'switchToLogin'],
    data() {
        return {
            inputRegister: {
                userName: '',
                email: '',
                password: '',
                phoneNumber: '',
                address: '',
            }
        }
    },
    methods: {
        doRegister() {
            this.$emit('doRegister', this.inputRegister);
        },
        switchToLogin() {
            this.$emit('switchToLogin')
        }
    }
}
</script>

<template>
    <section id="register-section">
      <div class="register-container">
        <h2 class="mb-4">Register</h2>
        <form>
          <div class="mb-3">
            <input v-model="inputRegister.userName" type="text" class="form-control" placeholder="Username" required />
          </div>
          <div class="mb-3">
            <input v-model="inputRegister.email" type="email" class="form-control" placeholder="Email" required />
          </div>
          <div class="mb-3">
            <input v-model="inputRegister.password" type="password" class="form-control" placeholder="Password" required />
          </div>
          <div class="mb-3">
            <input v-model="inputRegister.phoneNumber" type="tel" class="form-control" placeholder="Phone Number" required />
          </div>
          <div class="mb-3">
            <input v-model="inputRegister.address" type="text" class="form-control" placeholder="Address" required />
          </div>
          <button type="submit" @click.prevent="doRegister" class="btn btn-primary">Register</button>
        </form>
        <br>
        <button @click.prevent="switchToLogin" type="button" class="btn btn-warning">Already have an account</button>
      </div>
    </section>
</template>