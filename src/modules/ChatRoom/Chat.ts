export type Product = {
  id: string;
  price: number;
  vendor: string;
  name: string;
  brand: string;
  links: {
    product_url: string;
    image_url: string;
  };
  attributes: {
    size: string;
    type: string;
    material: string;
  };
  tags: string[];
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  products: Product[];
  timestamp: string;
};

type SenderId = 'user' | 'assistant';

export type Status = {
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
};

export type Message = {
  message_id: string;
  conversation_id: string;
  sender_id: SenderId;
  timestamp: string;
  question: string;
  answer_id: string | null;
  reply_to?: string | null;
  products?: Product[];
};

export type ChatResponse = {
  id: string;
  question: string;
  answer: string;
  products: Product[];
  timestamp: string;
};
