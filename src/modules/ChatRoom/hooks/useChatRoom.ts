import { ref, watch } from 'vue';
import type { Message, Status, ChatResponse } from 'src/modules/ChatRoom/Chat';

const useChatRoom = ({ initialMessage = '' }: { initialMessage: string }) => {
  const conversationId = ref<string | null>(null);
  const messages = ref<Partial<Message>[]>([]);
  const isProcessingMessage = ref(false);
  const status = ref<Status>({
    isLoading: false,
    error: null,
    isInitialized: false,
  });

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

          const [answer] = data.data.filter(
            (item: ChatResponse) => item.question === question.question,
          );
          // Simulate AI processing time
          await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

          if (answer) {
            // Create AI response
            const assistantMessage = createAssistantMessage(answer.answer, {
              reply_to: question.message_id ?? null,
              message_id: crypto.randomUUID?.() ?? String(Date.now()),
              products: answer.products,
            });
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
