import { ref, watch } from 'vue';
// import { queryFaqsByQuestion } from '../../../utils/query';
type SenderId = 'user' | 'assistant';

type Message = {
  message_id: string;
  conversation_id: string;
  sender_id: SenderId;
  timestamp: string;
  question: string;
  answer_id: string | null;
  reply_to?: string | null;
};

type Status = {
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
};

const useChatRoom = ({ initialMessage = '' }: { initialMessage: string }) => {
  const conversationId = ref<string | null>(null);
  const messages = ref<Partial<Message>[]>([]);
  const isProcessingMessage = ref(false);
  const status = ref<Status>({
    isLoading: false,
    error: null,
    isInitialized: false,
  });
  // const pendingQuestionIds = new Set<string>(); // TODO: Use for tracking pending messages

  const addMessage = (message: string) => {
    const defaultMessage: Partial<Message> = {
      conversation_id: conversationId.value!,
      sender_id: 'user',
      timestamp: new Date().toISOString(),
      message_id: crypto.randomUUID?.() ?? String(Date.now()),
      answer_id: null,
      reply_to: null,
    };

    messages.value = [...messages.value, { ...defaultMessage, question: message }];
  };

  const createAssistantMessage = (message: string, options: Partial<Message>) => {
    let defaultMessage: Message = {
      message_id: crypto.randomUUID?.() ?? String(Date.now()),
      conversation_id: conversationId.value!,
      sender_id: 'assistant',
      timestamp: new Date().toISOString(),
      question: message,
      answer_id: null,
      reply_to: null,
    };

    if (options) {
      defaultMessage = { ...defaultMessage, ...options };
    }

    return defaultMessage;
  };

  const createConversation = () => {
    if (conversationId.value) return;
    conversationId.value = crypto.randomUUID?.() ?? String(Date.now());
    // status.value.isInitialized = true;

    if (!status.value.isInitialized) {
      const message = createAssistantMessage(initialMessage, {});
      status.value.isInitialized = true;

      messages.value = [...messages.value, message];
    }
  };

  watch(
    () => messages.value.length,
    async () => {
      const unansweredQuestions = messages.value.filter(
        (message) => message.sender_id === 'user' && message.answer_id === null,
      );

      if (unansweredQuestions.length === 0) {
        isProcessingMessage.value = false;
        return;
      }

      isProcessingMessage.value = true;

      for (const question of unansweredQuestions) {
        try {
          const rawData = await fetch('/data.json');
          const data = await rawData.json();
          console.log(data, 'data');

          // Simulate AI processing time
          await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

          // Create AI response
          const assistantMessage = createAssistantMessage(
            'This is a placeholder response. The AI is processing your question...',
            {
              reply_to: question.message_id ?? null,
              message_id: crypto.randomUUID?.() ?? String(Date.now()),
            },
          );
          messages.value = [...messages.value, assistantMessage];

          // Mark the user question as answered
          const questionIndex = messages.value.findIndex(
            (m) => m.message_id === question.message_id,
          );
          if (questionIndex !== -1) {
            messages.value[questionIndex] = {
              ...messages.value[questionIndex],
              answer_id: assistantMessage.message_id,
            };
          }
        } catch (error) {
          console.error(error);
          // Add error message
          const errorMessage = createAssistantMessage(
            'Sorry, I encountered an error processing your request.',
            {
              reply_to: question.message_id ?? null,
              message_id: crypto.randomUUID?.() ?? String(Date.now()),
            },
          );
          messages.value = [...messages.value, errorMessage];
        }
      }

      isProcessingMessage.value = false;
    },
    { immediate: true },
  );

  return {
    status,
    createConversation,
    isLoading: status.value.isLoading,
    isProcessingMessage,
    messages,
    addMessage,
  };
};

export default useChatRoom;
