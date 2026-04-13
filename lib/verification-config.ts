export type DocumentType = 'PASSPORT' | 'SOCIAL_SECURITY' | 'NATIONAL_INSURANCE' | 'NATIONAL_ID';

export interface DocumentOption {
  type: DocumentType;
  label: string;
  description: string;
  /** Whether the back side of the document is required */
  requiresBack: boolean;
  /** Hint shown on the upload step */
  frontHint: string;
  backHint?: string;
}

// ─── Document definitions ────────────────────────────────────────────────────

const PASSPORT: DocumentOption = {
  type: 'PASSPORT',
  label: 'Passport',
  description: 'Any valid international passport (photo page)',
  requiresBack: false,
  frontHint: 'Upload the photo/bio page of your passport (the page with your photo and personal details).',
};

const SOCIAL_SECURITY: DocumentOption = {
  type: 'SOCIAL_SECURITY',
  label: 'Social Security / SIN Card',
  description: 'US Social Security card or Canadian SIN card',
  requiresBack: false,
  frontHint: 'Upload a clear photo of the front of your Social Security or SIN card.',
};

const NATIONAL_INSURANCE: DocumentOption = {
  type: 'NATIONAL_INSURANCE',
  label: 'National Insurance Card',
  description: 'UK National Insurance number card or HMRC letter',
  requiresBack: false,
  frontHint: 'Upload your NI card or the HMRC letter showing your National Insurance number.',
};

const NATIONAL_ID: DocumentOption = {
  type: 'NATIONAL_ID',
  label: 'National ID Card',
  description: 'Government-issued national identity card',
  requiresBack: true,
  frontHint: 'Upload the front side of your national ID card.',
  backHint: 'Upload the back side of your national ID card.',
};

// ─── Country → accepted documents ────────────────────────────────────────────

const COUNTRY_DOCS: Record<string, DocumentOption[]> = {
  // North America
  US: [PASSPORT, SOCIAL_SECURITY],
  CA: [PASSPORT, SOCIAL_SECURITY],

  // United Kingdom
  GB: [PASSPORT, NATIONAL_INSURANCE],

  // European Union / EEA
  DE: [PASSPORT, NATIONAL_ID],
  FR: [PASSPORT, NATIONAL_ID],
  IT: [PASSPORT, NATIONAL_ID],
  ES: [PASSPORT, NATIONAL_ID],
  NL: [PASSPORT, NATIONAL_ID],
  BE: [PASSPORT, NATIONAL_ID],
  PL: [PASSPORT, NATIONAL_ID],
  PT: [PASSPORT, NATIONAL_ID],
  SE: [PASSPORT, NATIONAL_ID],
  DK: [PASSPORT, NATIONAL_ID],
  FI: [PASSPORT, NATIONAL_ID],
  NO: [PASSPORT, NATIONAL_ID],
  AT: [PASSPORT, NATIONAL_ID],
  CH: [PASSPORT, NATIONAL_ID],
  IE: [PASSPORT, NATIONAL_ID],
  GR: [PASSPORT, NATIONAL_ID],
  CZ: [PASSPORT, NATIONAL_ID],
  HU: [PASSPORT, NATIONAL_ID],
  RO: [PASSPORT, NATIONAL_ID],
  BG: [PASSPORT, NATIONAL_ID],
  HR: [PASSPORT, NATIONAL_ID],
  SK: [PASSPORT, NATIONAL_ID],
  SI: [PASSPORT, NATIONAL_ID],
  EE: [PASSPORT, NATIONAL_ID],
  LV: [PASSPORT, NATIONAL_ID],
  LT: [PASSPORT, NATIONAL_ID],
  LU: [PASSPORT, NATIONAL_ID],
  MT: [PASSPORT, NATIONAL_ID],
  CY: [PASSPORT, NATIONAL_ID],
};

/** Returns accepted document options for a given ISO 3166-1 alpha-2 country code. */
export function getDocumentOptions(countryCode: string): DocumentOption[] {
  return COUNTRY_DOCS[countryCode] ?? [PASSPORT];
}

/** Returns the DocumentOption definition for a given type. */
export function getDocumentOption(type: DocumentType): DocumentOption {
  const map: Record<DocumentType, DocumentOption> = {
    PASSPORT: PASSPORT,
    SOCIAL_SECURITY: SOCIAL_SECURITY,
    NATIONAL_INSURANCE: NATIONAL_INSURANCE,
    NATIONAL_ID: NATIONAL_ID,
  };
  return map[type];
}

/** Human-readable label for a VerificationStatus value. */
export const VERIFICATION_STATUS_LABELS: Record<string, string> = {
  PENDING:      'Under Review',
  UNDER_REVIEW: 'Under Review',
  VERIFIED:     'Verified',
  REJECTED:     'Rejected',
};
