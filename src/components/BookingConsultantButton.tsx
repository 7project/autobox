"use client";

import React, { ReactNode } from "react";
import { navigateToConsultant } from "@/lib/consultant-navigate";

interface BookingConsultantButtonProps {
  prompt?: string;
  service?: string;
  promo?: string;
  from?: string;
  className?: string;
  children: ReactNode;
  title?: string;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function BookingConsultantButton({
  prompt,
  service,
  promo,
  from,
  className,
  children,
  title,
  ariaLabel,
  onClick,
}: BookingConsultantButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(e);
    navigateToConsultant({ prompt, service, promo, from });
  };

  const fallbackPrompt =
    prompt ||
    (service
      ? `Здравствуйте! Хочу записаться на услугу: «${service}». Какая ориентировочная стоимость и на когда можно записаться?`
      : promo
      ? `Здравствуйте! Хочу записаться по акции: «${promo}». Подскажите свободное время для визита.`
      : "Здравствуйте! Хочу записаться на диагностику и сервис.");

  const fallbackHref = `/?prompt=${encodeURIComponent(fallbackPrompt)}#ai-consultant`;

  return (
    <a
      href={fallbackHref}
      onClick={handleClick}
      className={className}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
