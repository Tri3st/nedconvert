<script setup lang="ts">
import MenuBar from "@/components/MenuBar.vue";
import MessageModal from "@/components/MessageModal.vue";
import {useMessageStore} from "@/stores/message.ts";
import {computed} from "vue";

const messageStore = useMessageStore();

const message = computed(() => messageStore.message);
const type = computed(() => messageStore.type);
const open = computed({
  get: () => messageStore.open,
  set: (value) => {
    messageStore.open = value
  }
});
</script>

<template>
  <MessageModal v-model:open="open" :message="message" :type="type" />
  <MenuBar />
  <RouterView />
</template>

<style scoped>
</style>
