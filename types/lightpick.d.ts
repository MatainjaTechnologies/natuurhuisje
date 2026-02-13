declare module 'lightpick' {
  interface LocaleOptions {
    firstDay?: number;
    weekdays?: {
      longhand?: string[];
      shorthand?: string[];
    };
    months?: {
      longhand?: string[];
      shorthand?: string[];
    };
    buttons?: {
      prev?: string;
      next?: string;
      close?: string;
      reset?: string;
      apply?: string;
    };
    tooltip?: {
      one?: string;
      other?: string;
    };
    tooltipOnDisabled?: string;
    pluralize?: (i: number, locale: any) => string;
  }

  interface Dropdowns {
    years?: {
      min: number;
      max: number | null;
    } | boolean;
    months?: boolean;
  }

  interface LightpickOptions {
    field: HTMLInputElement;
    secondField?: HTMLInputElement;
    firstDay?: number;
    parentEl?: string;
    lang?: string;
    format?: string;
    separator?: string;
    numberOfMonths?: number;
    numberOfColumns?: number;
    singleDate?: boolean;
    autoclose?: boolean;
    hideOnBodyClick?: boolean;
    repick?: boolean;
    minDate?: Date | string | number;
    maxDate?: Date | string | number;
    disableDates?: (Date | string | number | [Date | string | number, Date | string | number])[];
    selectForward?: boolean;
    selectBackward?: boolean;
    minDays?: number;
    maxDays?: number;
    hoveringTooltip?: boolean;
    footer?: boolean | string;
    disabledDatesInRange?: boolean;
    tooltipNights?: boolean;
    orientation?: string;
    disableWeekends?: boolean;
    inline?: boolean;
    dropdowns?: Dropdowns;
    locale?: LocaleOptions;
    onSelect?: (start?: Date, end?: Date) => void;
    onOpen?: () => void;
    onClose?: () => void;
  }

  class Lightpick {
    constructor(options: LightpickOptions);
    destroy(): void;
    setStartDate(date: Date): void;
    setEndDate(date: Date): void;
    clear(): void;
  }

  export default Lightpick;
}
