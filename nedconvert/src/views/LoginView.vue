<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import type {Rule} from "ant-design-vue/es/form";
import {useAuthStore} from "@/stores/auth.ts";
import {useRouter} from "vue-router";
import {useMessageStore} from "@/stores/message.ts";

const authStore = useAuthStore();
const messageStore = useMessageStore();
const router = useRouter();

interface FormState {
  user: string;
  pass: string;
}

const formRef = ref<any>();

const formState = reactive<FormState>({
  user: '',
  pass: ''
});

const validUsername = (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('Please provide a username');
  }
  if (value.length < 5){
    return Promise.reject('The username must be at least 6 characters long and start with a number or a character')
  } else {
    return Promise.resolve();
  }
}
const validPassword = (_rule: Rule, value: string) => {
  if (!value) {
    return Promise.reject('Please provide a password');
  }
  const valid = /^(?=.*[A-Z])(?=.*\d).{7,}$/.test(value);
  if (value.length < 8 || !valid){
    return Promise.reject('The password must be at least 8 characters long and contain at least one uppercase letter and one number')
  } else {
    return Promise.resolve();
  }
}

const rules: Record<string, Rule[]> ={
  pass: [{required:true, validator: validPassword, trigger: 'change'}],
  user: [{required:true, validator: validUsername, trigger: 'change'}]
}

const loginUser = async () => {
  try {
    await formRef.value.validate();
    console.log("Log in user and password : ", formState);
    await authStore.login(formState);
    if (authStore.isAuthenticated()) {
      messageStore.show("You are logged in", "success");
      router.push("/");
    } else {
      messageStore.show("Invalid username or password", "warning");
    }
    resetForm();
  } catch (error) {
    messageStore.show("Error logging in", "warning");
    console.log("Error logging in : ", error);
  }
}


const resetForm = () => {
  formState.user = '';
  formState.pass = '';
};

watch(formState, () => {
  formRef.value?.clearValidate();
})

</script>

<template>
  <a-flex vertical justify="center" align="center" class="login-container">
    <a-card class="login-card" :bordered="true">
      <h1 class="login-title">LOGIN</h1>
      <a-form
        ref="formRef"
        layout="horizontal"
        :rules="rules"
        :model="formState"
      >
        <a-form-item
          label="Username"
          class="form-item"
          help="Username must be at least 6 characters long and must start with a number or a character"
          has-feedback
          name="user"
        >
          <a-input v-model:value="formState.user" placeholder="Enter your username" autocomplete="off"/>
        </a-form-item>

        <a-form-item
          label="Password"
          class="form-item"
          help="Password must be at least 8 characters long and contain at least one uppercase letter and one number"
          has-feedback
          name="pass"
        >
          <a-input v-model:value="formState.pass" type="password" placeholder="Enter your password" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" block @click="loginUser">Login</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </a-flex>

</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
}

.login-card {
  width: 350px;
  padding: 20px;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>