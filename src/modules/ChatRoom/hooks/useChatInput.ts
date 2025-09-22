import { ref, computed } from 'vue';

export type ChatInputOptions = {
  disabled?: boolean;
};

const useChatInput = (options: ChatInputOptions = {}) => {
  const { disabled = false } = options;

  const draft = ref('');

  const canSend = computed(() => {
    return draft.value.trim().length > 0 && !disabled;
  });

  const clear = () => {
    draft.value = '';
  };

  const send = () => {
    const message = draft.value.trim();
    if (message && canSend.value) {
      clear();
      return message;
    }
    return null;
  };

  const setDraft = (value: string) => {
    draft.value = value;
  };

  return {
    draft,
    canSend,
    disabled,
    clear,
    send,
    setDraft,
  };
};

export default useChatInput;
