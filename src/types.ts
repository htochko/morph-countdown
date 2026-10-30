export type TimeUnit = 'years' | 'months' | 'days' | 'hours' | 'minutes' | 'seconds';

export type PluralForms = [string, string, string];

export interface TimeUnitDefinition {
  short: string;
  forms: PluralForms;
}

export type I18nDictionary = Record<TimeUnit, TimeUnitDefinition>;

export interface GlyphGraphics {
  topHTML: string;
  bottomHTML: string;
  matrixTop: string;
  matrixBottom: string;
}

export interface CountdownTheme {
  name: string;
  glyphs: Record<string, GlyphGraphics>;
}

export interface CountdownOptions {
  targetDate?: string | Date;
  i18n?: I18nDictionary;
  theme?: CountdownTheme;
  showYears?: boolean;
  showSeparators?: boolean;
  commercialLicenseKey?: string;
}