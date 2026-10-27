const PATHS = {
  bag: "M5 8h14l-1.2 12H6.2zM9 8V6.5a3 3 0 0 1 6 0V8",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  close: "M6 6l12 12M18 6 6 18",
  check: "m5 12.5 4.5 4.5L19 7.5",
  arrow: "M5 12h14M13 6l6 6-6 6",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  team: "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5M13.8 14.4c.7-.3 1.4-.4 2.2-.4 2.7 0 4.9 2 5.5 5",
  trash: "M5 7h14M9 7V5h6v2M7 7l1 12h8l1-12",
  chat: "M4 5h16v11H9l-5 4z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
};

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

export function BallMark({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" className="ball-mark">
      <circle cx="16" cy="16" r="13" fill="#f4f6f8" />
      <path d="M16 10.5 21 14l-1.9 5.8h-6.2L11 14z" fill="#0b0f0c" />
      <path d="M16 3v7.5M21 14l7-2.5M19.1 19.8l4.3 6M12.9 19.8l-4.3 6M11 14l-7-2.5" stroke="#0b0f0c" strokeWidth="1.6" fill="none" />
      <circle cx="16" cy="16" r="13" fill="none" stroke="#2fd65f" strokeWidth="2" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" />
    </svg>
  );
}
