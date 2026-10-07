"use client";

export interface NavigateToConsultantOptions {
  prompt?: string;
  service?: string;
  promo?: string;
  from?: string;
}

/**
 * Universal helper to navigate to the AI consultant from any button/page,
 * scroll into view smoothly, pre-fill a ready prompt, and focus the input field.
 */
export function navigateToConsultant(options: NavigateToConsultantOptions = {}) {
  if (typeof window === "undefined") return;

  const promptText =
    options.prompt ||
    (options.service
      ? `Здравствуйте! Хочу записаться на услугу: «${options.service}». Какая ориентировочная стоимость и на когда можно записаться?`
      : options.promo
      ? `Здравствуйте! Хочу записаться по акции: «${options.promo}». Подскажите свободное время для визита.`
      : "Здравствуйте! Хочу записаться на диагностику и сервис в Автобокс74rus на ул. Печёнкина, 1а. Подскажите свободное время.");

  const sourceBadge =
    options.service
      ? `Услуга: ${options.service}`
      : options.promo
      ? `Акция: ${options.promo}`
      : options.from || "Запись онлайн";

  // Check if AI consultant element exists on current page (e.g. homepage or kontakty)
  const targetElement =
    document.getElementById("ai-consultant") ||
    document.getElementById("ai-chat");

  if (targetElement) {
    // 1. Scroll smoothly to AI consultant
    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

    // 2. Dispatch custom event to pre-fill input and focus
    window.dispatchEvent(
      new CustomEvent("autobox:prefill-consultant", {
        detail: {
          prompt: promptText,
          sourceBadge,
          service: options.service,
          promo: options.promo,
        },
      })
    );
  } else {
    // Navigate to homepage with query params and hash
    const query = new URLSearchParams({
      prompt: promptText,
      from: sourceBadge,
    });
    if (options.service) query.set("service", options.service);
    if (options.promo) query.set("promo", options.promo);

    window.location.href = `/?${query.toString()}#ai-consultant`;
  }
}
