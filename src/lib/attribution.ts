/**
 * Откуда человек пришёл: страница записи, источник перехода и utm-метки.
 * Метки запоминаются на время визита, чтобы переход по ссылке внутри сайта
 * не стирал источник, с которого человек начал.
 */
const STORAGE_KEY = "atomy-attribution";

export interface Attribution {
  pageUrl: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
}

const EMPTY: Attribution = {
  pageUrl: "",
  referrer: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
};

const UTM_FIELDS = [
  ["utm_source", "utmSource"],
  ["utm_medium", "utmMedium"],
  ["utm_campaign", "utmCampaign"],
  ["utm_content", "utmContent"],
  ["utm_term", "utmTerm"],
] as const;

function fromLocation(): Attribution {
  if (typeof window === "undefined") return { ...EMPTY };

  const params = new URLSearchParams(window.location.search);
  const found: Attribution = {
    ...EMPTY,
    pageUrl: window.location.href,
    referrer: document.referrer || "",
  };
  for (const [param, field] of UTM_FIELDS) {
    found[field] = params.get(param)?.trim() ?? "";
  }
  return found;
}

function hasUtm(value: Attribution): boolean {
  return UTM_FIELDS.some(([, field]) => value[field]);
}

function readStored(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Attribution>) };
  } catch {
    return null;
  }
}

function store(value: Attribution): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Приватный режим браузера: источник просто не запомнится до отправки.
  }
}

/** Источник для отправляемой записи: свежие метки важнее запомненных. */
export function captureAttribution(): Attribution {
  const current = fromLocation();
  const stored = readStored();

  if (!stored) {
    store(current);
    return current;
  }

  if (hasUtm(current)) {
    const merged: Attribution = {
      ...current,
      // Первый источник перехода не перезаписываем: он и есть настоящий.
      referrer: stored.referrer || current.referrer,
    };
    store(merged);
    return merged;
  }

  return { ...stored, pageUrl: current.pageUrl || stored.pageUrl };
}
