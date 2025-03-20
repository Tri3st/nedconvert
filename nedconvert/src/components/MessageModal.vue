<script setup lang="ts">
import {watch, ref, h, computed} from "vue";
import {ExclamationCircleOutlined, CheckCircleOutlined, InfoCircleOutlined} from "@ant-design/icons-vue";

/** Props for the MessageModal component. the props are typed already */
const props = defineProps<{
  message: string;
  type: 'success' | 'warning' | 'info';
  open: boolean;
}>();

/** Emitting the update:open event to the parent component */
const emit = defineEmits(['update:open']);

/** The open state of the modal using a vue ref */
const open = ref<boolean>(false);

/** Watching the open prop for changes and updating the open state of the modal accordingly */
watch(
  () => props.open,
  (newOpen) => {
    open.value = newOpen;
  }
);

/** Handlers for the modal OK button */
const handleOk = () => {
  emit('update:open', false);
};

/** Handlers for the modal Cancel button */
const handleCancel = () => {
  emit('update:open', false);
}

/** Computed property to return the icon based on the type prop */
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

/** Computed property to return the title based on the type prop */
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

/** Computed property to return the style based on the type prop */
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

/** Computed property to return the titleVNode based on the type prop */
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