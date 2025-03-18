import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

interface MessageState {
  message: Ref<string>;
  type: Ref<'success' | 'warning' | 'info'>;
  open: Ref<boolean>;
}

type UseMessageStoreReturn = MessageState & {
  show: (message: string, type: 'success' | 'warning' | 'info') => void;
  close: () => void;
};

export const useMessageStore = defineStore('message', (): UseMessageStoreReturn => {
  const message: Ref<string> = ref('');
  const type: Ref<'success' | 'warning' | 'info'> = ref('info');
  const open: Ref<boolean> = ref(false);

  const show = (newMessage: string, newType: 'success' | 'warning' | 'info') => {
    message.value = newMessage;
    type.value = newType;
    open.value = true;
  };

  const close = () => {
    open.value = false;
    message.value = '';
    type.value = 'info';
  };

  return {
    message,
    type,
    open,
    show,
    close,
  };
});