<template>
  <div>
    <h1>Sign in</h1>
    
    <p>
      <label>
        <input type="radio" v-model="userType" value="user" /> 
        user
      </label>
      <label style="margin-left: 20px;">
        <input type="radio" v-model="userType" value="admin" /> 
        admin
      </label>
    </p>

    <p><input type="text" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    
    <p>
      <button @click="signin">Sign in</button>
      <button @click="signout" style="margin-left: 10px;" v-if="isLoggedIn">
        Sign out
      </button>
    </p>


    <p v-if="isLoggedIn" style="color: green;">
      login as: {{ currentUserType === 'admin' ? 'admin' : 'user' }}
    </p>

    <p v-if="errorMessage" style="color: red;">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const userType = ref(""); 
const isLoggedIn = ref(false);
const currentUserType = ref("");
const errorMessage = ref("");
const router = useRouter();
const auth = getAuth();


const adminCredentials = {
  email: "admin",
  password: "12345678"
};

const signin = () => {
  errorMessage.value = ""; 
  
  if (userType.value === "admin") {

    if (email.value === adminCredentials.email && password.value === adminCredentials.password) {
      console.log("Success!");
      isLoggedIn.value = true;
      currentUserType.value = "admin";
      router.push("/");
    } else {
      errorMessage.value = "wrong";
    }
  } else {

    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((data) => {
        console.log("Firebase Login Successful!");
        isLoggedIn.value = true;
        currentUserType.value = "user";
        router.push("/"); 
        console.log(auth.currentUser); 
      })
      .catch((error) => {
        console.log(error.code);
        switch(error.code) {
          case 'auth/user-not-found':
            errorMessage.value = "wrong";
            break;
          case 'auth/wrong-password':
            errorMessage.value = "wrong";
            break;
          case 'auth/invalid-email':
            errorMessage.value = "wrong";
            break;
          default:
            errorMessage.value = "wrong";
        }
      });
  }
};

const signout = () => {
  if (currentUserType.value === "admin") {

    isLoggedIn.value = false;
    currentUserType.value = "";
    email.value = "";
    password.value = "";
    console.log("Sign out successful");
  } else {

    signOut(auth).then(() => {
      console.log("Sign out successful");
      isLoggedIn.value = false;
      currentUserType.value = "";
      email.value = "";
      password.value = "";
    }).catch((error) => {
      console.log("wrong:", error);
      errorMessage.value = "wrong";
    });
  }
};


onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user && currentUserType.value !== "admin") {
      isLoggedIn.value = true;
      currentUserType.value = "user";
    } else if (!user && currentUserType.value !== "admin") {
      isLoggedIn.value = false;
      currentUserType.value = "";
    }
  });
});
</script>