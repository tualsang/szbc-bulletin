import { forwardRef, useRef } from 'react';
import { Bulletin, ProgramSection, ProgramRow } from '../lib/schema';
import { CHURCH_INFO } from '../lib/constants';
import { addDays, formatDate, dayName } from '../lib/date';
import { formatMoney } from '../lib/money';
import { useFitContent } from '../lib/fit-content';

interface Props {
  bulletin: Bulletin;
}

/**
 * Renders the print-ready PNG source: 3300×2550 landscape (11×8.5" at 300 DPI),
 * containing TWO identical bulletin halves side-by-side. Print landscape on
 * letter paper, cut down the middle vertically, get two 5.5×8.5" copies.
 */
export const PrintRender = forwardRef<HTMLDivElement, Props>(function PrintRender(
  { bulletin },
  ref
) {
  return (
    <div
      ref={ref}
      style={{
        width: '3300px',
        height: '2550px',
        background: '#ffffff',
        display: 'flex',
        fontFamily: 'Manrope, system-ui, sans-serif',
        color: '#1c1917',
      }}
    >
      <BulletinHalf bulletin={bulletin} />
      <BulletinHalf bulletin={bulletin} />
    </div>
  );
});

/* ===================== HALF ===================== */

function BulletinHalf({ bulletin }: { bulletin: Bulletin }) {
  const innerRef = useRef<HTMLDivElement>(null);
  useFitContent(innerRef, 24, 14);

  return (
    <div
      style={{
        width: '1650px',
        height: '2550px',
        padding: '80px 90px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px dashed #d6d3d1',
        overflow: 'hidden',
      }}
    >
      <div
        ref={innerRef}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          fontSize: '24px',
          lineHeight: 1.35,
        }}
      >
        <Header bulletin={bulletin} />
        <TodaysProgram section={bulletin.todaysProgram} />
        <div style={{ flex: 1, minHeight: 0 }} />
        <Offering offering={bulletin.offering} />
        <NextWeekGrid bulletin={bulletin} />
        <ContactInfo />
      </div>
    </div>
  );
}

/* ===================== HEADER ===================== */

function Header({ bulletin }: { bulletin: Bulletin }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
      <div style={{ fontWeight: 700, fontSize: '1.1em', letterSpacing: '0.05em' }}>
        {formatDate(bulletin.date, { withDay: true }).toUpperCase()}
      </div>
      <h1
        style={{
          fontFamily: '"Bebas Neue", Impact, sans-serif',
          fontSize: '2.6em',
          letterSpacing: '0.04em',
          margin: '12px 0 8px',
          lineHeight: 1.05,
        }}
      >
        {CHURCH_INFO.name}
      </h1>
      <div
        style={{
          fontFamily: 'Lora, Georgia, serif',
          fontStyle: 'italic',
          fontSize: '0.95em',
          margin: '6px 0 4px',
        }}
      >
        {CHURCH_INFO.verse}
      </div>
      <div
        style={{
          fontFamily: 'Lora, Georgia, serif',
          fontStyle: 'italic',
          fontSize: '0.85em',
          color: '#44403c',
        }}
      >
        {CHURCH_INFO.address}
      </div>
      <hr
        style={{
          border: 'none',
          borderTop: '2px solid #1c1917',
          margin: '18px 0 0',
        }}
      />
    </div>
  );
}

/* ===================== TODAY'S PROGRAM ===================== */

function TodaysProgram({ section }: { section: ProgramSection }) {
  const visibleRows = section.rows.filter((r) => r.label.trim() || r.value.trim());
  if (visibleRows.length === 0 && !section.hasCommunion) return null;

  return (
    <div style={{ marginBottom: '20px' }}>
      <SectionHeader title="Today's Program" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {visibleRows.map((row) => (
          <ProgramRowDisplay key={row.id} row={row} />
        ))}
        {section.hasCommunion && (
          <NekkhawmDisplay label={section.nekkhawmLabel} names={section.nekkhawmNames} />
        )}
      </div>
    </div>
  );
}

/* ===================== OFFERING ===================== */

function Offering({ offering }: { offering: Bulletin['offering'] }) {
  const sehsuah = formatMoney(offering.sehsuah);
  const citpiak = formatMoney(offering.citpiak);
  if (!sehsuah && !citpiak) return null;

  return (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-block',
          borderTop: '1.5px solid #1c1917',
          borderBottom: '1.5px solid #1c1917',
          padding: '10px 28px',
          fontSize: '0.95em',
        }}
      >
        {sehsuah && (
          <span style={{ marginRight: citpiak ? '28px' : 0 }}>
            <span style={{ fontWeight: 700 }}>Sehsuah:</span> {sehsuah}
          </span>
        )}
        {citpiak && (
          <span>
            <span style={{ fontWeight: 700 }}>Citpiak:</span> {citpiak}
          </span>
        )}
      </div>
    </div>
  );
}

/* ===================== NEXT WEEK 2-COL GRID ===================== */

function NextWeekGrid({ bulletin }: { bulletin: Bulletin }) {
  const satISO = addDays(bulletin.date, 6);
  const sunISO = addDays(bulletin.date, 7);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '20px',
      }}
    >
      {/* LEFT: Saturday + Saturday Night */}
      <div>
        <SaturdayBlock saturday={bulletin.nextWeekSaturday} dateISO={satISO} />
        <SaturdayNightBlock data={bulletin.nextWeekSaturdayNight} />
      </div>
      {/* RIGHT: Sunday */}
      <div>
        <SundayBlock section={bulletin.nextWeekSunday} dateISO={sunISO} />
      </div>
    </div>
  );
}

function SaturdayBlock({
  saturday,
  dateISO,
}: {
  saturday: Bulletin['nextWeekSaturday'];
  dateISO: string;
}) {
  const visibleRows = saturday.rows.filter((r) => r.label.trim() || r.value.trim());
  if (visibleRows.length === 0 && !saturday.subtitle.trim()) return null;

  return (
    <div style={{ marginBottom: '14px' }}>
      <DayHeader day={dayName(dateISO)} date={formatDate(dateISO)} subtitle={saturday.subtitle} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {visibleRows.map((row) => (
          <ProgramRowDisplay key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
}

function SaturdayNightBlock({
  data,
}: {
  data: Bulletin['nextWeekSaturdayNight'];
}) {
  if (!data.chairperson.trim() && !data.sermon.trim()) return null;
  return (
    <div style={{ marginTop: '12px' }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: '0.95em',
          borderBottom: '1px solid #57534e',
          paddingBottom: '4px',
          marginBottom: '6px',
        }}
      >
        Saturday Night Service
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {data.chairperson.trim() && (
          <ProgramRowDisplay row={{ id: 'c', label: 'Chairperson', value: data.chairperson }} />
        )}
        {data.sermon.trim() && (
          <ProgramRowDisplay row={{ id: 's', label: 'Sermon', value: data.sermon }} />
        )}
      </div>
    </div>
  );
}

function SundayBlock({ section, dateISO }: { section: ProgramSection; dateISO: string }) {
  const visibleRows = section.rows.filter((r) => r.label.trim() || r.value.trim());
  if (visibleRows.length === 0 && !section.hasCommunion) return null;

  return (
    <div>
      <DayHeader day={dayName(dateISO)} date={formatDate(dateISO)} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {visibleRows.map((row) => (
          <ProgramRowDisplay key={row.id} row={row} />
        ))}
        {section.hasCommunion && (
          <NekkhawmDisplay
            label={section.nekkhawmLabel}
            names={section.nekkhawmNames}
            compact
          />
        )}
      </div>
    </div>
  );
}

/* ===================== CONTACT INFO ===================== */

function ContactInfo() {
  return (
    <div style={{ marginTop: '16px' }}>
      <SectionHeader title="Contact Information" small />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', fontSize: '0.88em' }}>
        {CHURCH_INFO.contacts.map((c) => (
          <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>
              <span style={{ fontWeight: 700 }}>{c.role}:</span> {c.name}
            </span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{c.phone}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: '10px',
          fontSize: '0.85em',
          textAlign: 'center',
          borderTop: '1px solid #d6d3d1',
          paddingTop: '8px',
        }}
      >
        <span style={{ fontWeight: 700 }}>Zelle (Main):</span> {CHURCH_INFO.zelle.main}
        {'  •  '}
        <span style={{ fontWeight: 700 }}>Zelle (Building):</span> {CHURCH_INFO.zelle.building}
      </div>
    </div>
  );
}

/* ===================== SHARED PIECES ===================== */

function SectionHeader({ title, small }: { title: string; small?: boolean }) {
  return (
    <div
      style={{
        fontFamily: 'Lora, Georgia, serif',
        fontStyle: 'italic',
        fontSize: small ? '1em' : '1.1em',
        borderBottom: '1.5px solid #1c1917',
        paddingBottom: '4px',
        marginBottom: '10px',
        fontWeight: 600,
      }}
    >
      {title}
    </div>
  );
}

function DayHeader({ day, date, subtitle }: { day: string; date: string; subtitle?: string }) {
  return (
    <div
      style={{
        marginBottom: '8px',
        borderBottom: '1.5px solid #1c1917',
        paddingBottom: '4px',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '1em' }}>
        {day}, {date}
        {subtitle ? (
          <span style={{ fontWeight: 400, fontStyle: 'italic' }}> — {subtitle}</span>
        ) : null}
      </div>
    </div>
  );
}

function ProgramRowDisplay({ row }: { row: ProgramRow }) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
      <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{row.label}:</span>
      <span style={{ whiteSpace: 'pre-wrap' }}>{row.value}</span>
    </div>
  );
}

/* Nekkhawm: 6 names → 3 rows × 2 cols, ONE NAME PER CELL. */
function NekkhawmDisplay({
  label,
  names,
  compact = false,
}: {
  label: string;
  names: string[];
  compact?: boolean;
}) {
  const trimmed = names.map((n) => n.trim());
  if (trimmed.every((n) => !n)) return null;

  // Build 3 rows of 2.
  const rows = [
    [trimmed[0], trimmed[1]],
    [trimmed[2], trimmed[3]],
    [trimmed[4], trimmed[5]],
  ];

  // Reduce size slightly so each name comfortably fits one line.
  const fontSize = compact ? '0.85em' : '0.92em';

  return (
    <div style={{ marginTop: compact ? '6px' : '10px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <div style={{ fontWeight: 700, whiteSpace: 'nowrap', fontSize }}>{label}:</div>
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            columnGap: '16px',
            rowGap: '2px',
            fontSize,
          }}
        >
          {rows.flat().map((name, i) => (
            <div
              key={i}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
