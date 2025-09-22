import { defineBoot } from '#q-app/wrappers';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = (typeof messages)['en-US'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-object-type */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type */

export default defineBoot(({ app }) => {
  const savedLanguage = localStorage.getItem('language') as MessageLanguages;
  const defaultLocale = savedLanguage && savedLanguage in messages ? savedLanguage : 'en-US';

  console.log('i18n setup:', {
    savedLanguage,
    defaultLocale,
    availableLocales: Object.keys(messages),
    browserLanguage: navigator.language,
  });

  const i18n = createI18n<MessageSchema, MessageLanguages>({
    locale: defaultLocale,
    legacy: false,
    messages,
    fallbackLocale: 'en-US',
    flatJson: true,
  });

  app.use(i18n);

  i18n.global.locale = defaultLocale;
});
