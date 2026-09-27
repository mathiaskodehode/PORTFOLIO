import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import no from "./locales/no.json";

export const SUPPORTED_LOCALES = ["en", "no"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const STORAGE_KEY = "locale";

function isSupportedLocale(value: string | null | undefined): value is Locale {
    return SUPPORTED_LOCALES.includes(value as Locale);
}

function detectInitialLocale(): Locale {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isSupportedLocale(stored)) return stored;

    const browserLanguage = navigator.language?.slice(0, 2);
    if (isSupportedLocale(browserLanguage)) return browserLanguage;

    return "en";
}

export const i18n = createI18n({
    legacy: false,
    locale: detectInitialLocale(),
    fallbackLocale: "en",
    messages: { en, no },
});

export function setLocale(locale: Locale): void {
    i18n.global.locale.value = locale;
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
}

document.documentElement.lang = i18n.global.locale.value;
