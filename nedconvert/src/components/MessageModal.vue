<script setup lang="ts">
import {watch, ref, h, computed} from "vue";
import {ExclamationCircleOutlined, CheckCircleOutlined, InfoCircleOutlined} from "@ant-design/icons-vue";

const props = defineProps<{
  message: string;
  type: 'success' | 'warning' | 'info';
  open: boolean;
}>();
const emit = defineEmits(['update:open']);

const open = ref<boolean>(false);

watch(
  () => props.open,
  (newOpen) => {
    open.value = newOpen;
  }
);

const handleOk = () => {
  emit('update:open', false);
};

const handleCancel = () => {
  emit('update:open', false);
}

const getIcon = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleOutlined;
    case 'warning':
      return ExclamationCircleOutlined;
    case 'info':
      return InfoCircleOutlined;
    default:
      return InfoCircleOutlined;
  }
});

const getTitle = computed(() => {
  switch (props.type) {
    case 'success':
      return 'Success';
    case 'warning':
      return 'Warning';
    case 'info':
      return 'Info';
    default:
      return 'Info';
  }
})

const getStyle = computed(() => {
  switch (props.type) {
    case 'success':
      return { color: 'green' };
    case 'warning':
      return { color: 'orange'};
    case 'info':
      return  { color: 'blue'};
    default:
      return { color: 'blue'};
  }
});

const titleVNode = computed(() => {
  return h('span',
      {style: getStyle.value },
      [h(getIcon.value), getTitle.value]
  );
})
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="titleVNode"
    @ok="handleOk"
    @cancel="handleCancel"
    :mask-closable="false"
    :closable="false"
  >
    <p>{{ message }}</p>
  </a-modal>
</template>

<style scoped>

</style>