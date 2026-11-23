// No React here: app/layout.tsx (a server component) imports this.

export type TextSize = "sm" | "md" | "lg" | "xl";

export const SETTINGS_STORAGE_KEY = "app-settings";

export const TEXT_SIZE_PX: Record<TextSize, number> = { sm: 14, md: 16, lg: 18, xl: 20 };

// Runs in <head> before the page paints, so there is no flash of the wrong size / font
export const SETTINGS_BOOT_SCRIPT = `(function(){try{var s=JSON.parse(localStorage.getItem("${SETTINGS_STORAGE_KEY}")||"{}");var px=${JSON.stringify(TEXT_SIZE_PX)}[s.textSize];if(px)document.documentElement.style.fontSize=px+"px";if(s.font)document.documentElement.dataset.font=s.font;}catch(e){}})();`;
