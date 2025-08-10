<template>
  <h1>Create an Account</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="register">Save to Firebase</button></p>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const router = useRouter()
const auth = getAuth()

const register = () => {
  console.log("Register clicked. Email:", email.value, "Password:", password.value)
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("✅ Register Success:", data)
      router.push("/FireLogin")
    })
    .catch((error) => {
      console.error("❌ Register Failed:", error.code, error.message)
      alert("注册失败：" + error.message)
    })
}

</script>