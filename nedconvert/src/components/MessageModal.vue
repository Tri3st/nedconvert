<script setup lang="ts">
import {watch, ref, h} from "vue";
import {ExclamationCircleOutlined, CheckCircleOutlined, InfoCircleOutlined} from "@ant-design/icons-vue";
import type {ModalProps} from "ant-design-vue";

const props = defineProps<{
  message: string;
  type: 'success' | 'warning' | 'info';
  open: boolean;
}>();
const emit = defineEmits(['update:open']);

const open = ref<boolean>(false);
const modalRef = ref<ModalProps | null>(null);

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

const getIcon = () => {
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
}

const getTitle = () => {
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
}

const getStyle = () => {
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
}
</script>

<template>
  <a-modal
    v-model:open="open"
    :title="() => h('span', {style: getStyle() }, [h(getIcon()), getTitle()])"
    @ok="handleOk"
    :mask-closable="false"
    :closable="false"
  >
    <p>{{ message }}</p>
  </a-modal>
</template>

<style scoped>

</style>