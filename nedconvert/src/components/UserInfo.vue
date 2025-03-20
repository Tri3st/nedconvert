<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import {useAuthStore} from "@/stores/auth.ts";
import {useRouter} from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

/** Props for the UserInfo component,
 *    user: the username
 *    role: 'admin' or 'user' (from the db) */
defineProps<{
  user: string;
  role: string;
}>();

/** Do the logout magic */
const logout = () => {
  authStore.logout();
  router.push("/login");
}
</script>

<template>
  <a-flex :gap="4" align="center" class="user-info-container">
    <a-avatar :style="{'background-color': role === 'admin' ? 'red' : 'blue'}">
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
    <a-space :size="16"></a-space>
    <div class="user-name">
      {{ user }}
    </div>
    <a-button @click="logout" class="logout-button">Logout</a-button>
  </a-flex>
</template>

<style scoped>

</style>