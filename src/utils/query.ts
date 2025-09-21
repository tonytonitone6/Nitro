import type { Faq } from '../modules/ChatRoom/Chat';

export function queryFaqsByQuestion(faqArrays: Faq[], keyword: string) {
  const normalizedKeyword = keyword.toLowerCase();
  const matchedFaqs = faqArrays.filter((faq) =>
    faq.question.toLowerCase().includes(normalizedKeyword),
  );
  return matchedFaqs;
}
