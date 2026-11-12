# Project Design Rules: Swiss Modernism 2.0 (Airport Operations)

Whenever writing, editing, or generating front-end code (HTML, React, CSS, Tailwind) for this repository:

1. **Strict 0px Border Radius**:
   - Every single element MUST have 0px radius (`rounded-none`, `border-radius: 0 !important`).
   - Never use `rounded-md`, `rounded-lg`, `rounded-full`, or pill shapes.

2. **Absolute Flat 2D Elevation**:
   - Zero drop-shadows (`box-shadow: none !important;`).
   - Zero backdrop blur or 3D layers.
   - Separation must be achieved strictly with 1px hairline borders (`border border-[#E5E7EB]` or `border border-black`).

3. **Color Palette Discipline**:
   - Backgrounds: Solid Pure White (`#FFFFFF`) and Crisp Light Gray (`#F5F5F5`).
   - Typography & Active Bounds: Core Black (`#000000`).
   - Single Expressive Accent: Swiss Red (`#DC2626`). Use only for critical interactions, key state indicators, primary live alerts, or deliberate editorial emphasis.
   - Subordinate Text: Dark Gray (`#4B5563`).

4. **Typography & Indexing**:
   - Sans font: `Inter`, `"Helvetica Neue"`, `sans-serif`.
   - Mono font: `"JetBrains Mono"`, `monospace`.
   - Use tabular numbers (`font-feature-settings: 'tnum'`).
   - Section/Item indexing MUST use monospace tags like `[ 01 ]`, `[ 02 ]`.
   - Category tags & input labels MUST be in uppercase `label-caps` with letter-spacing `0.08em`.

5. **Detailed references**:
   - See `design-rules/DESIGN.md` for full design tokens and color dictionary.
   - See `design-rules/UI_COMPONENTS.md` for standard component code templates.
   - See `design-rules/AIRPORT_DOMAIN_RULES.md` for IATA codes, PNR formatting, and passenger rules.
