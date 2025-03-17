<script setup lang="ts">
import {ref, h, onMounted, computed} from 'vue';
import UserInfo from "@/components/UserInfo.vue";
import { EditOutlined, CalculatorOutlined } from "@ant-design/icons-vue";
import type {MenuProps} from "ant-design-vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth.ts";

const router = useRouter();
const authStore = useAuthStore();

const current = ref<string[]>([router.currentRoute.value.path])
const items = ref<MenuProps['items']>([
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

const currentUser = computed(() => authStore.currentUser());

const onMenuClick: MenuProps['onClick'] = (e) => {
  router.push(e.item.to);  // Navigate to the selected route
}

onMounted(async () => {
  await authStore.checkSession();

  if(!authStore.isAuthenticated()) {
    router.push('/login');
  }
});
</script>

<template>
  <a-flex gap="large" align="center" justify="space-between">
    <a-menu v-model:selectedKeys="current" :items="items" mode="horizontal" @click="onMenuClick"/>
    <UserInfo class="user-info" :user="currentUser?.username" :role="currentUser?.role" v-if="currentUser"/>
    <a-button class="login-button" type="primary" ghost @click="router.push('/login')" v-else>LOGIN</a-button>
  </a-flex>

</template>

<style scoped>
.user-info, .login-button {
  margin-right: 20px;
}
</style>