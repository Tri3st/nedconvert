<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import {useAuthStore} from "@/stores/auth.ts";
import {useRouter} from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

defineProps<{
  user: string;
  role: string;
}>();

const logout = () => {
  authStore.logout();
  router.push("/login");
}
</script>

<template>
  <a-flex :gap="4" align="center">
    <a-avatar :style="{'background-color': role === 'admin' ? 'red' : 'blue'}">
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
    <a-space :size="16"></a-space>
    <div>
      {{ user }}
    </div>
    <a-button danger @click="logout">Logout</a-button>
  </a-flex>
</template>

<style scoped>

</style>