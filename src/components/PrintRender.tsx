import { forwardRef, useRef } from 'react';
import { Bulletin, ProgramSection, ProgramRow } from '../lib/schema';
import { CHURCH_INFO } from '../lib/constants';
import { addDays, formatDateShort, dayName } from '../lib/date';
import { formatMoney } from '../lib/money';
import { useFitToFill } from '../lib/fit-content';

interface Props {
  bulletin: Bulletin;
  /** When true, render only one half at 1650×2550 instead of two side-by-side. */
  singleHalf?: boolean;
}

export const PrintRender = forwardRef<HTMLDivElement, Props>(function PrintRender(
  { bulletin, singleHalf = false },
  ref
) {
  return (
    <div
      ref={ref}
      style={{
        width: singleHalf ? '1650px' : '3300px',
        height: '2550px',
        background: '#ffffff',
        display: 'flex',
        fontFamily: 'Manrope, system-ui, sans-serif',
        color: '#000000',
      }}
    >
      <BulletinHalf bulletin={bulletin} />
      {!singleHalf && <BulletinHalf bulletin={bulletin} />}
    </div>
  );
});

const RULE = '2px solid #000000';
const SOFT_RULE = '1px solid #000000';

/* ===================== HALF ===================== */

function BulletinHalf({ bulletin }: { bulletin: Bulletin }) {
  const dateDisplay =
    bulletin.dateOverride.trim() || formatDateShort(bulletin.date);

  return (
    <div
      style={{
        width: '1650px',
        height: '2550px',
        // Top padding is now absorbed by the date band; keep horizontal + bottom padding.
        padding: '0 90px 80px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Date band: fixed-height box that vertically centers the date between
          the very top of the half and the rule below it. */}
      <div
        style={{
          height: '130px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '46px',
          color: '#000000',
        }}
      >
        {dateDisplay}
      </div>
      <div style={{ borderTop: RULE }} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          fontSize: '30px',
          lineHeight: 1.3,
          color: '#000000',
          fontWeight: 400,
        }}
      >
        <Header />
        <TodaysProgramFitted section={bulletin.todaysProgram} />
        <div style={{ flex: 1, minHeight: 0 }} />

        {/* Next-week area runs larger than Today's Program. */}
        <div style={{ fontSize: '38px' }}>
          <Offering offering={bulletin.offering} />
          <NextWeekGrid bulletin={bulletin} />
          <ContactInfo />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1
        style={{
          fontFamily: '"Bebas Neue", Impact, sans-serif',
          fontSize: '3.0em',
          letterSpacing: '0.08em',
          margin: '8px 0 6px',
          lineHeight: 1.0,
          fontWeight: 400,
        }}
      >
        {CHURCH_INFO.name}
      </h1>

      <div
        style={{
          fontFamily: 'Lora, Georgia, serif',
          fontStyle: 'italic',
          fontSize: '1.0em',
          margin: '0 0 2px',
        }}
      >
        {CHURCH_INFO.verse}
      </div>
      <div
        style={{
          fontFamily: 'Lora, Georgia, serif',
          fontStyle: 'italic',
          fontSize: '0.9em',
          marginBottom: '10px',
        }}
      >
        {CHURCH_INFO.address}
      </div>

      <div style={{ borderTop: RULE }} />
    </div>
  );
}

/* ===================== TODAY'S PROGRAM (fills available space) ===================== */

/**
 * Wraps Today's Program in a flex:1 container that absorbs all vertical space
 * between the header and the offering. The inner content's font-size is
 * grown via useFitToFill so the rows naturally expand to fill that space
 * (capped at 44px so single-row weeks don't get absurd).
 */
function TodaysProgramFitted({ section }: { section: ProgramSection }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useFitToFill(containerRef, contentRef, { min: 36, max: 60 });

  const visibleRows = section.rows.filter((r) => r.label.trim() || r.value.trim());
  const empty = visibleRows.length === 0 && !section.hasCommunion;

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 0',
      }}
    >
      <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            textAlign: 'center',
            fontSize: '0.7em',
            marginBottom: '6px',
          }}
        >
          Today&rsquo;s Program
        </div>

        {!empty && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {visibleRows.map((row) => (
              <ProgramRowDisplay key={row.id} row={row} />
            ))}
            {section.hasCommunion && (
              <NekkhawmDisplay
                label={section.nekkhawmLabel}
                names={section.nekkhawmNames}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== OFFERING ===================== */

function Offering({ offering }: { offering: Bulletin['offering'] }) {
  const sehsuah = formatMoney(offering.sehsuah);
  const citpiak = formatMoney(offering.citpiak);
  const hasMoney = sehsuah || citpiak;

  return (
    <div style={{ margin: '10px 0' }}>
      <div style={{ borderTop: SOFT_RULE, marginBottom: '8px' }} />
      <div style={{ textAlign: 'center', fontSize: '0.95em', lineHeight: 1.35 }}>
        {hasMoney && (
          <div>
            {sehsuah && (
              <span style={{ marginRight: citpiak ? '40px' : 0 }}>
                <span style={{ fontWeight: 600 }}>Sehsuah:</span> {sehsuah}
              </span>
            )}
            {citpiak && (
              <span>
                <span style={{ fontWeight: 600 }}>Citpiak:</span> {citpiak}

              </span>
            )}
          </div>
        )}
        <div style={{ fontSize: '1.1em' }}>
          <strong>Sehsuah &amp; Citpiak Zelle:</strong> {CHURCH_INFO.zelle.main}
        </div>
        <div style={{ fontSize: '1.1em' }}>
          <strong>Building Fund Zelle:</strong> {CHURCH_INFO.zelle.building}
        </div>
      </div>
      <div style={{ borderTop: SOFT_RULE, marginTop: '8px' }} />
    </div>
  );
}

/* ===================== NEXT WEEK 2-COL ===================== */

function NextWeekGrid({ bulletin }: { bulletin: Bulletin }) {
  const satISO = addDays(bulletin.date, 6);
  const sunISO = addDays(bulletin.date, 7);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '10px',
      }}
    >
      <div>
        <SaturdayBlock saturday={bulletin.nextWeekSaturday} dateISO={satISO} />
        <SaturdayNightBlock data={bulletin.nextWeekSaturdayNight} />
      </div>
      <div>
        <SundayBlock section={bulletin.nextWeekSunday} dateISO={sunISO} />
      </div>
    </div>
  );
}

/** Day header now CENTERED. */
function DayHeader({ day, date }: { day: string; date: string }) {
  return (
    <div style={{ marginBottom: '4px', textAlign: 'center' }}>
      <span style={{ fontWeight: 600, fontSize: '1.0em' }}>{day}</span>{' '}
      <span style={{ fontSize: '1.0em' }}>{date}</span>
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
    <div style={{ marginBottom: '12px' }}>
      <DayHeader day={dayName(dateISO)} date={formatDateShort(dateISO)} />
      {saturday.subtitle.trim() && (
        <div
          style={{
            textAlign: 'left',
            fontWeight: 600,
            fontSize: '1.0em',
            margin: '2px 0 4px',
          }}
        >
          {saturday.subtitle}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {visibleRows.map((row) => (
          <ProgramRowDisplay key={row.id} row={row} compact />
        ))}
      </div>
    </div>
  );
}

/** Now reads from data.rows like every other section. */
function SaturdayNightBlock({
  data,
}: {
  data: Bulletin['nextWeekSaturdayNight'];
}) {
  const visibleRows = data.rows.filter((r) => r.label.trim() || r.value.trim());
  if (visibleRows.length === 0 && !data.serviceType) return null;

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ fontWeight: 600, fontSize: '1.0em', marginBottom: '4px' }}>
        Saturday Night Service
      </div>

      {data.serviceType && (
        <div
          style={{
            fontWeight: 600,
            fontSize: '0.95em',
            marginBottom: '4px',
          }}
        >
          {data.serviceType}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {visibleRows.map((row) => (
          <ProgramRowDisplay key={row.id} row={row} compact />
        ))}
      </div>
    </div>
  );
}

function SundayBlock({
  section,
  dateISO,
}: {
  section: ProgramSection;
  dateISO: string;
}) {
  const visibleRows = section.rows.filter((r) => r.label.trim() || r.value.trim());
  if (visibleRows.length === 0 && !section.hasCommunion) return null;

  return (
    <div>
      <DayHeader day={dayName(dateISO)} date={formatDateShort(dateISO)} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {visibleRows.map((row) => (
          <ProgramRowDisplay key={row.id} row={row} compact />
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
    <div style={{ marginTop: '6px' }}>
      <div style={{ borderTop: SOFT_RULE, marginBottom: '8px' }} />
      <div
        style={{
          fontFamily: 'Lora, Georgia, serif',
          fontSize: '0.95em',
          textAlign: 'center',
          marginBottom: '6px',
        }}
      >
        Contact Information
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',   // was 'auto auto auto'
          columnGap: '32px',
          rowGap: '2px',
          // remove: justifyContent: 'center',
          fontSize: '0.88em',
        }}
      >
        {CHURCH_INFO.contacts.map((c) => (
          <ContactRow key={c.name} role={c.role} name={c.name} phone={c.phone} />
        ))}
      </div>
    </div>
  );
}

function ContactRow({
  role,
  name,
  phone,
}: {
  role: string;
  name: string;
  phone: string;
}) {
  return (
    <>
      <div style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{role}:&nbsp;</div>
      <div style={{ whiteSpace: 'nowrap' }}>{name}</div>
      <div style={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
        {phone}
      </div>
    </>
  );
}

/* ===================== SHARED PIECES ===================== */

function ProgramRowDisplay({ row, compact }: { row: ProgramRow; compact?: boolean }) {
  const label = row.label.replace(/:\s*$/, '');
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        fontSize: compact ? '0.95em' : '1.0em',
        lineHeight: 1.3,
      }}
    >
      <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{label}:&nbsp;</span>
      <span style={{ whiteSpace: 'pre-line', flex: 1 }}>{row.value}</span>
    </div>
  );
}

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

  // Left column = names 1-3, right column = names 4-6 (top-down per column,
  // not row-major). This matches the original PSD reference and reads left-
  // top-down → right-top-down.
  const left = [trimmed[0], trimmed[1], trimmed[2]];
  const right = [trimmed[3], trimmed[4], trimmed[5]];

  // No font override — names render at the same size as program-row values
  // above them. Compact mode (narrow next-week Sunday column) drops one notch
  // since space is tight there.
  const fontSize = compact ? '0.85em' : '1em';

  return (
    <div style={{ fontSize, lineHeight: 1.3 }}>
      {/* Label line — same weight/size as a program row's label. */}
      <div style={{ fontWeight: 600 }}>{label.replace(/:\s*$/, '')}:</div>

      {/* Names laid out as two columns of three. Each name on its own line. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: '16px',
          paddingLeft: '1em', // indent under the label
        }}
      >
        <div>
          {left.map((n, i) => (
            <div key={i} style={{ whiteSpace: 'nowrap' }}>{n}</div>
          ))}
        </div>
        <div>
          {right.map((n, i) => (
            <div key={i} style={{ whiteSpace: 'nowrap' }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}