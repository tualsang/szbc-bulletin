import { z } from 'zod';

export const ProgramRowSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
});
export type ProgramRow = z.infer<typeof ProgramRowSchema>;

export const ProgramSectionSchema = z.object({
  rows: z.array(ProgramRowSchema),
  hasCommunion: z.boolean(),
  communionGroup: z.union([z.literal(1), z.literal(2)]),
  nekkhawmLabel: z.string(),
  nekkhawmNames: z.array(z.string()).length(6),
});
export type ProgramSection = z.infer<typeof ProgramSectionSchema>;

export const ServiceTypeSchema = z.enum(['', 'Nupi Hun', 'Khangno Hun']);
export type ServiceType = z.infer<typeof ServiceTypeSchema>;

export const Bulletin = z.object({
  date: z.string(),
  dateOverride: z.string().default(''),
  todaysProgram: ProgramSectionSchema,
  offering: z.object({
    sehsuah: z.string(),
    citpiak: z.string(),
  }),
  nextWeekSaturday: z.object({
    subtitle: z.string(),
    rows: z.array(ProgramRowSchema),
  }),
  nextWeekSaturdayNight: z.object({
    serviceType: ServiceTypeSchema.default(''),
    rows: z.array(ProgramRowSchema),
  }),
  nextWeekSunday: ProgramSectionSchema,
});

export type Bulletin = z.infer<typeof Bulletin>;

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

export function emptyRow(label = '', value = ''): ProgramRow {
  return { id: newId(), label, value };
}

export function defaultTodaysProgram(): ProgramSection {
  return {
    rows: [
      emptyRow('Hunuk', ''),
      emptyRow('Phatna leh Biakpiakna', 'Shalom Worship Team'),
      emptyRow('Sumpi-Apna', ''),
      emptyRow('Thuzaksakna', "Shalom' Departments"),
      emptyRow('Thungetna', ''),
      emptyRow('Hanthotna', ''),
      emptyRow('Tawpna Thungetna', ''),
    ],
    hasCommunion: false,
    communionGroup: 1,
    nekkhawmLabel: 'Nekkhawm',
    nekkhawmNames: ['', '', '', '', '', ''],
  };
}

export function defaultNextWeekSunday(): ProgramSection {
  return {
    rows: [
      emptyRow('Hunuk', ''),
      emptyRow('Hanthotna', ''),
      emptyRow('Sumpi-Apna', ''),
      emptyRow('Thungetna', ''),
    ],
    hasCommunion: false,
    communionGroup: 1,
    nekkhawmLabel: 'Nekkhawm',
    nekkhawmNames: ['', '', '', '', '', ''],
  };
}

export function defaultBulletin(dateISO: string): Bulletin {
  return {
    date: dateISO,
    dateOverride: '',
    todaysProgram: defaultTodaysProgram(),
    offering: { sehsuah: '', citpiak: '' },
    nextWeekSaturday: {
      subtitle: 'Saturday Thunget',
      rows: [emptyRow('Amun', 'Biakinn'), emptyRow('Ahun', '10:00 AM'), emptyRow('LST', '')],
    },
    nextWeekSaturdayNight: {
      serviceType: '',
      rows: [emptyRow('Chairperson', ''), emptyRow('Sermon', '')],
    },
    nextWeekSunday: defaultNextWeekSunday(),
  };
}