<script setup lang="ts">
import {ref, h, onMounted, computed} from 'vue';
import UserInfo from "@/components/UserInfo.vue";
import { EditOutlined, CalculatorOutlined } from "@ant-design/icons-vue";
import type {MenuProps} from "ant-design-vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.ts";

/** Use the vue-router to get the current route */
const router = useRouter();

/** Use the auth store to get the current user */
const authStore = useAuthStore();

/** The current route path */
const current = ref<string[]>([router.currentRoute.value.path])

/** The menu items (we can add more later (features upon request) */
const items = ref<MenuProps['items'] & { to: string }[]>([
  {
    key: 'makequote',
    icon: () => h(EditOutlined),
    label: 'Make Quote',
    title: 'Make Quote',
    to: '/create'
  },
  {
    key: 'convert',
    icon: () => h(CalculatorOutlined),
    label: 'Convert Currency',
    title: 'Convert Currency',
    to: '/convert'
  },
])

/** The current user from the auth store */
const currentUser = computed(() => authStore.currentUser());

/** onClick handler for the menu items */
const onMenuClick: MenuProps['onClick'] = (e) => {
  router.push(e.item.to);  // Navigate to the selected route
}

/** When the component is mounted, we check for a session and check if the user is logged in
 * If not we redirect to the login page */
onMounted(async () => {
  await authStore.checkSession();

  if(!authStore.isAuthenticated()) {
    await router.push('/login');
  }
});
</script>

<template>
  <a-card class="neu-bar-card">
    <a-flex gap="large" align="center" justify="space-between" class="menu-bar-container">
      <a-menu v-model:selectedKeys="current" :items="items" mode="horizontal" @click="onMenuClick" class="menu-bar"/>
      <a-flex align="center" gap="middle">
        <UserInfo class="user-info" :user="currentUser?.username" :role="currentUser?.role" v-if="currentUser"/>
        <a-button class="login-button" type="primary" ghost @click="router.push('/login')" v-else>LOGIN</a-button>
      </a-flex>
    </a-flex>
  </a-card>
</template>

<style scoped>
.user-info, .login-button {
  margin-right: 20px;
}
</style>