import { computed } from 'vue';
import { useI18n as useVueI18n } from 'vue-i18n';

export function useI18nHelpers() {
  const { t, locale, availableLocales } = useVueI18n();

  const languages = computed(() => [{ code: 'en-US' }, { code: 'zh-TW' }]);

  const currentLanguage = computed(() => {
    return languages.value.find((lang) => lang.code === locale.value) || languages.value[0];
  });

  const changeLanguage = (langCode: string) => {
    if (availableLocales.includes(langCode)) {
      locale.value = langCode;
      localStorage.setItem('language', langCode);
    }
  };

  const initLanguage = () => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && availableLocales.includes(savedLanguage)) {
      locale.value = savedLanguage;
    }
  };

  return {
    t,
    locale,
    languages,
    currentLanguage,
    changeLanguage,
    initLanguage,
  };
}

export default useI18nHelpers;
