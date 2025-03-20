<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import type {Rule} from "ant-design-vue/es/form";
import {useAuthStore} from "@/stores/auth.ts";
import {useRouter} from "vue-router";
import {useMessageStore} from "@/stores/message.ts";

/** Use the auth store to get the current user */
const authStore = useAuthStore();

/** Use the message store to show messages to the user */
const messageStore = useMessageStore();

/** Use the vue-router to navigate to other pages */
const router = useRouter();

/** FommState types */
interface FormState {
  user: string;
  pass: string;
}

/** formRef state by using a ref */
const formRef = ref<any>();

/** formState state by using a reactive object
 * We use a formState to keep track of the values of the inputs */
const formState = reactive<FormState>({
  user: '',
  pass: ''
});

/** Check if the username is valid according to our rules */
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

/** Check if the password is valid according to our rules */
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

/** The rules of the form, see documentation of ant-design-vue for more information */
const rules: Record<string, Rule[]> ={
  pass: [{required:true, validator: validPassword, trigger: 'change'}],
  user: [{required:true, validator: validUsername, trigger: 'change'}]
}

/** Try to log the user in and handle errors */
const loginUser = async () => {
  try {
    await formRef.value.validate();
    console.log("Log in user and password : ", formState);
    await authStore.login(formState);
    if (authStore.isAuthenticated()) {
      messageStore.show("You are logged in", "success");
      await router.push("/");
    } else {
      messageStore.show("Invalid username or password", "warning");
    }
    resetForm();
  } catch (error) {
    messageStore.show("There was an error logging in", "warning");
    console.log("Error logging in : ", error);
  }
}

/** Reset the form state to empty strings */
const resetForm = () => {
  formState.user = '';
  formState.pass = '';
};

/** watch the formState for changes and clear the validation errors */
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