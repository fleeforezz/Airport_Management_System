const fs = require('fs');
const path = require('path');

// Entity models definition
const entities = [
  {
    id: 'AIRPORT',
    name: 'AIRPORT',
    x: 40,
    y: 40,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: '', name: 'iata_code', type: 'VARCHAR(3)' },
      { key: '', name: 'icao_code', type: 'VARCHAR(4)' },
      { key: '', name: 'name', type: 'VARCHAR(150)' },
      { key: '', name: 'city', type: 'VARCHAR(100)' },
      { key: '', name: 'country', type: 'VARCHAR(100)' },
      { key: '', name: 'timezone', type: 'VARCHAR(50)' },
    ]
  },
  {
    id: 'DESTINATION',
    name: 'DESTINATION',
    x: 40,
    y: 350,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: 'FK', name: 'airport_id', type: 'INT' },
      { key: '', name: 'code', type: 'VARCHAR(10)' },
      { key: '', name: 'name', type: 'VARCHAR(100)' },
      { key: '', name: 'city', type: 'VARCHAR(100)' },
      { key: '', name: 'country', type: 'VARCHAR(100)' },
      { key: '', name: 'image_url', type: 'VARCHAR(255)' },
      { key: '', name: 'climate', type: 'VARCHAR(100)' },
    ]
  },
  {
    id: 'COUPON',
    name: 'COUPON',
    x: 40,
    y: 690,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: '', name: 'code', type: 'VARCHAR(30)' },
      { key: '', name: 'description', type: 'VARCHAR(255)' },
      { key: '', name: 'discount_percent', type: 'DECIMAL(5,2)' },
      { key: '', name: 'discount_amount', type: 'DECIMAL(12,2)' },
      { key: '', name: 'min_spend', type: 'DECIMAL(12,2)' },
      { key: '', name: 'max_discount', type: 'DECIMAL(12,2)' },
      { key: '', name: 'valid_until', type: 'DATETIME' },
      { key: '', name: 'usage_count', type: 'INT' },
      { key: '', name: 'is_active', type: 'BOOLEAN' },
    ]
  },
  {
    id: 'ARTICLE',
    name: 'ARTICLE',
    x: 40,
    y: 1070,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: 'FK', name: 'author_id', type: 'INT' },
      { key: '', name: 'slug', type: 'VARCHAR(150)' },
      { key: '', name: 'title', type: 'VARCHAR(200)' },
      { key: '', name: 'summary', type: 'TEXT' },
      { key: '', name: 'content', type: 'LONGTEXT' },
      { key: '', name: 'category', type: 'VARCHAR(30)' },
      { key: '', name: 'published_at', type: 'DATETIME' },
    ]
  },
  {
    id: 'AIRLINE',
    name: 'AIRLINE',
    x: 390,
    y: 40,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: '', name: 'iata_code', type: 'VARCHAR(2)' },
      { key: '', name: 'icao_code', type: 'VARCHAR(3)' },
      { key: '', name: 'name', type: 'VARCHAR(100)' },
      { key: '', name: 'country', type: 'VARCHAR(100)' },
      { key: '', name: 'logo_url', type: 'VARCHAR(255)' },
    ]
  },
  {
    id: 'TOUR',
    name: 'TOUR',
    x: 390,
    y: 300,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: 'FK', name: 'destination_id', type: 'INT' },
      { key: 'FK', name: 'airline_id', type: 'INT' },
      { key: '', name: 'code', type: 'VARCHAR(20)' },
      { key: '', name: 'title', type: 'VARCHAR(150)' },
      { key: '', name: 'subtitle', type: 'VARCHAR(255)' },
      { key: '', name: 'price', type: 'DECIMAL(12,2)' },
      { key: '', name: 'duration_days', type: 'INT' },
      { key: '', name: 'duration_nights', type: 'INT' },
      { key: '', name: 'departure_city', type: 'VARCHAR(100)' },
      { key: '', name: 'transport_type', type: 'VARCHAR(20)' },
      { key: '', name: 'status', type: 'VARCHAR(20)' },
    ]
  },
  {
    id: 'ITINERARY_DAY',
    name: 'ITINERARY_DAY',
    x: 390,
    y: 730,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: 'FK', name: 'tour_id', type: 'INT' },
      { key: '', name: 'day_number', type: 'INT' },
      { key: '', name: 'title', type: 'VARCHAR(150)' },
      { key: '', name: 'description', type: 'TEXT' },
      { key: '', name: 'meals', type: 'VARCHAR(100)' },
      { key: '', name: 'stay', type: 'VARCHAR(150)' },
    ]
  },
  {
    id: 'USER_ACCOUNT',
    name: 'USER_ACCOUNT',
    x: 390,
    y: 1040,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: '', name: 'username', type: 'VARCHAR(50)' },
      { key: '', name: 'email', type: 'VARCHAR(100)' },
      { key: '', name: 'password_hash', type: 'VARCHAR(255)' },
      { key: '', name: 'full_name', type: 'VARCHAR(100)' },
      { key: '', name: 'phone', type: 'VARCHAR(20)' },
      { key: '', name: 'role', type: 'VARCHAR(20)' },
      { key: '', name: 'zalo_id', type: 'VARCHAR(64)' },
      { key: '', name: 'created_at', type: 'DATETIME' },
    ]
  },
  {
    id: 'AIRCRAFT',
    name: 'AIRCRAFT',
    x: 740,
    y: 40,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: 'FK', name: 'airline_id', type: 'INT' },
      { key: '', name: 'registration_number', type: 'VARCHAR(20)' },
      { key: '', name: 'model', type: 'VARCHAR(100)' },
      { key: '', name: 'capacity', type: 'INT' },
      { key: '', name: 'status', type: 'VARCHAR(20)' },
    ]
  },
  {
    id: 'FLIGHT',
    name: 'FLIGHT',
    x: 740,
    y: 290,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: 'FK', name: 'tour_id', type: 'INT' },
      { key: 'FK', name: 'origin_airport_id', type: 'INT' },
      { key: 'FK', name: 'destination_airport_id', type: 'INT' },
      { key: 'FK', name: 'airline_id', type: 'INT' },
      { key: 'FK', name: 'aircraft_id', type: 'INT' },
      { key: '', name: 'flight_number', type: 'VARCHAR(10)' },
      { key: '', name: 'departure_time', type: 'DATETIME' },
      { key: '', name: 'arrival_time', type: 'DATETIME' },
      { key: '', name: 'terminal', type: 'VARCHAR(10)' },
      { key: '', name: 'gate', type: 'VARCHAR(10)' },
      { key: '', name: 'total_seats', type: 'INT' },
      { key: '', name: 'seats_available', type: 'INT' },
      { key: '', name: 'price', type: 'DECIMAL(12,2)' },
      { key: '', name: 'status', type: 'VARCHAR(20)' },
    ]
  },
  {
    id: 'BOOKING',
    name: 'BOOKING',
    x: 740,
    y: 810,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: '', name: 'booking_reference', type: 'VARCHAR(12)' },
      { key: 'FK', name: 'user_id', type: 'INT' },
      { key: 'FK', name: 'flight_id', type: 'INT' },
      { key: 'FK', name: 'tour_id', type: 'INT' },
      { key: 'FK', name: 'coupon_id', type: 'INT' },
      { key: '', name: 'customer_name', type: 'VARCHAR(100)' },
      { key: '', name: 'customer_email', type: 'VARCHAR(100)' },
      { key: '', name: 'customer_phone', type: 'VARCHAR(20)' },
      { key: '', name: 'adults_count', type: 'INT' },
      { key: '', name: 'children_count', type: 'INT' },
      { key: '', name: 'total_price', type: 'DECIMAL(12,2)' },
      { key: '', name: 'discount_amount', type: 'DECIMAL(12,2)' },
      { key: '', name: 'booking_status', type: 'VARCHAR(20)' },
      { key: '', name: 'created_at', type: 'DATETIME' },
    ]
  },
  {
    id: 'PAYMENT',
    name: 'PAYMENT',
    x: 740,
    y: 1320,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: 'FK', name: 'booking_id', type: 'INT' },
      { key: '', name: 'transaction_reference', type: 'VARCHAR(64)' },
      { key: '', name: 'amount', type: 'DECIMAL(12,2)' },
      { key: '', name: 'payment_method', type: 'VARCHAR(20)' },
      { key: '', name: 'payment_status', type: 'VARCHAR(20)' },
      { key: '', name: 'created_at', type: 'DATETIME' },
    ]
  },
  {
    id: 'SEAT',
    name: 'SEAT',
    x: 1090,
    y: 40,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: 'FK', name: 'aircraft_id', type: 'INT' },
      { key: '', name: 'seat_number', type: 'VARCHAR(5)' },
      { key: '', name: 'travel_class', type: 'VARCHAR(20)' },
      { key: '', name: 'is_exit_row', type: 'BOOLEAN' },
    ]
  },
  {
    id: 'SEAT_ASSIGNMENT',
    name: 'SEAT_ASSIGNMENT',
    x: 1090,
    y: 330,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: 'FK', name: 'passenger_id', type: 'INT' },
      { key: 'FK', name: 'flight_id', type: 'INT' },
      { key: 'FK', name: 'seat_id', type: 'INT' },
      { key: 'FK', name: 'booking_id', type: 'INT' },
      { key: '', name: 'assigned_seat_number', type: 'VARCHAR(5)' },
      { key: '', name: 'boarding_group', type: 'VARCHAR(10)' },
      { key: '', name: 'is_checked_in', type: 'BOOLEAN' },
    ]
  },
  {
    id: 'PASSENGER',
    name: 'PASSENGER',
    x: 1090,
    y: 810,
    fields: [
      { key: 'PK', name: 'id', type: 'INT' },
      { key: 'FK', name: 'booking_id', type: 'INT' },
      { key: '', name: 'full_name', type: 'VARCHAR(100)' },
      { key: '', name: 'date_of_birth', type: 'DATE' },
      { key: '', name: 'id_or_passport', type: 'VARCHAR(50)' },
      { key: '', name: 'gender', type: 'VARCHAR(10)' },
      { key: '', name: 'passenger_type', type: 'VARCHAR(10)' },
    ]
  }
];

// Relationships / Foreign Keys
const relationships = [
  { fromTable: 'AIRPORT', toTable: 'FLIGHT', label: 'originates (1:N)' },
  { fromTable: 'AIRPORT', toTable: 'FLIGHT', label: 'terminates (1:N)' },
  { fromTable: 'AIRPORT', toTable: 'DESTINATION', label: 'serves (1:N)' },
  { fromTable: 'AIRLINE', toTable: 'AIRCRAFT', label: 'operates (1:N)' },
  { fromTable: 'AIRLINE', toTable: 'FLIGHT', label: 'dispatches (1:N)' },
  { fromTable: 'AIRLINE', toTable: 'TOUR', label: 'partner carrier (1:N)' },
  { fromTable: 'AIRCRAFT', toTable: 'SEAT', label: 'configured with (1:N)' },
  { fromTable: 'AIRCRAFT', toTable: 'FLIGHT', label: 'assigned aircraft (1:N)' },
  { fromTable: 'DESTINATION', toTable: 'TOUR', label: 'located at (1:N)' },
  { fromTable: 'TOUR', toTable: 'ITINERARY_DAY', label: 'scheduled into (1:N)' },
  { fromTable: 'TOUR', toTable: 'FLIGHT', label: 'bundles flight (1:N)' },
  { fromTable: 'TOUR', toTable: 'BOOKING', label: 'packaged tour (1:N)' },
  { fromTable: 'FLIGHT', toTable: 'BOOKING', label: 'booked flight (1:N)' },
  { fromTable: 'FLIGHT', toTable: 'SEAT_ASSIGNMENT', label: 'flight seats (1:N)' },
  { fromTable: 'SEAT', toTable: 'SEAT_ASSIGNMENT', label: 'occupies physical seat (1:N)' },
  { fromTable: 'BOOKING', toTable: 'PASSENGER', label: 'manifests (1:N)' },
  { fromTable: 'BOOKING', toTable: 'PAYMENT', label: 'settled by (1:N)' },
  { fromTable: 'BOOKING', toTable: 'SEAT_ASSIGNMENT', label: 'booking seats (1:N)' },
  { fromTable: 'PASSENGER', toTable: 'SEAT_ASSIGNMENT', label: 'allocated to (1:N)' },
  { fromTable: 'USER_ACCOUNT', toTable: 'BOOKING', label: 'places order (1:N)' },
  { fromTable: 'USER_ACCOUNT', toTable: 'ARTICLE', label: 'authors (1:N)' },
  { fromTable: 'COUPON', toTable: 'BOOKING', label: 'applies voucher (1:N)' },
];

const TABLE_WIDTH = 270;
const HEADER_HEIGHT = 30;
const ROW_HEIGHT = 26;
const KEY_COL_WIDTH = 36;
const VAL_COL_WIDTH = TABLE_WIDTH - KEY_COL_WIDTH;

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

function generateDrawioXml() {
  let cellIdCounter = 100;
  const tableCells = {}; // tableId -> cell id
  const rowCells = {};   // tableId.fieldName -> cell id
  let xml = '';

  xml += '<mxfile host="Electron">\n';
  xml += '  <diagram name="Airport_ERD" id="Airport_ERD_Diagram">\n';
  xml += '    <mxGraphModel dx="2800" dy="1600" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="2400" pageHeight="1800" math="0" shadow="0">\n';
  xml += '      <root>\n';
  xml += '        <mxCell id="0" />\n';
  xml += '        <mxCell id="1" parent="0" />\n';

  // Title Banner
  const titleId = `cell_${cellIdCounter++}`;
  xml += `        <mxCell id="${titleId}" parent="1" style="text;html=1;align=left;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontFamily=Helvetica;fontSize=18;fontStyle=1;fontColor=#0F172A;" value="AIRPORT MANAGEMENT &amp; BOOKING SYSTEM — ENTITY RELATIONSHIP DIAGRAM (ERD)" vertex="1">\n`;
  xml += `          <mxGeometry x="40" y="8" width="800" height="24" as="geometry" />\n`;
  xml += `        </mxCell>\n`;

  // Render Entities
  entities.forEach((entity) => {
    const tableId = `tbl_${entity.id}`;
    tableCells[entity.id] = tableId;
    const rowCount = entity.fields.length;
    const tableHeight = HEADER_HEIGHT + rowCount * ROW_HEIGHT;

    // Table container
    // Swiss Modernism 2.0: Deep black/slate header, sharp zero radius, crisp contrast
    const tableStyle = 'shape=table;startSize=30;container=1;collapsible=1;childLayout=tableLayout;fixedRows=1;rowLines=0;fontStyle=1;align=center;resizeLast=1;html=1;fillColor=#0F172A;fontColor=#FFFFFF;strokeColor=#0F172A;swimlaneFillColor=#FFFFFF;fontFamily=Helvetica;fontSize=12;';
    xml += `        <mxCell id="${tableId}" parent="1" style="${tableStyle}" value="${escapeXml(entity.name)}" vertex="1">\n`;
    xml += `          <mxGeometry x="${entity.x}" y="${entity.y}" width="${TABLE_WIDTH}" height="${tableHeight}" as="geometry" />\n`;
    xml += `        </mxCell>\n`;

    // Rows
    entity.fields.forEach((field, idx) => {
      const rowId = `row_${entity.id}_${field.name}`;
      rowCells[`${entity.id}.${field.name}`] = rowId;
      const rowY = HEADER_HEIGHT + idx * ROW_HEIGHT;

      // Row container
      const rowStyle = 'shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=none;collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;top=0;left=0;right=0;bottom=1;strokeColor=#E2E8F0;';
      xml += `        <mxCell id="${rowId}" parent="${tableId}" style="${rowStyle}" value="" vertex="1">\n`;
      xml += `          <mxGeometry y="${rowY}" width="${TABLE_WIDTH}" height="${ROW_HEIGHT}" as="geometry" />\n`;
      xml += `        </mxCell>\n`;

      // Key Cell (PK / FK)
      const keyId = `key_${entity.id}_${field.name}`;
      let keyColor = '#64748B';
      let keyFontWeight = '0';
      if (field.key === 'PK') {
        keyColor = '#DC2626'; // Swiss red
        keyFontWeight = '1';
      } else if (field.key === 'FK') {
        keyColor = '#2563EB'; // Royal blue
        keyFontWeight = '1';
      }

      const keyStyle = `shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;fontStyle=${keyFontWeight};fontColor=${keyColor};align=center;fontFamily=Helvetica;fontSize=10;overflow=hidden;whiteSpace=wrap;html=1;`;
      xml += `        <mxCell id="${keyId}" parent="${rowId}" style="${keyStyle}" value="${escapeXml(field.key)}" vertex="1">\n`;
      xml += `          <mxGeometry width="${KEY_COL_WIDTH}" height="${ROW_HEIGHT}" as="geometry">\n`;
      xml += `            <mxRectangle width="${KEY_COL_WIDTH}" height="${ROW_HEIGHT}" as="alternateBounds" />\n`;
      xml += `          </mxGeometry>\n`;
      xml += `        </mxCell>\n`;

      // Field Name & Type Cell
      const valId = `val_${entity.id}_${field.name}`;
      const displayText = `${field.name} : ${field.type}`;
      const isBold = field.key === 'PK' ? '1' : '0';
      const valFontColor = field.key === 'PK' ? '#0F172A' : '#334155';
      const valStyle = `shape=partialRectangle;connectable=0;fillColor=none;top=0;left=0;bottom=0;right=0;align=left;spacingLeft=6;fontStyle=${isBold};fontColor=${valFontColor};fontFamily=Courier New,Courier,monospace;fontSize=11;overflow=hidden;whiteSpace=wrap;html=1;`;

      xml += `        <mxCell id="${valId}" parent="${rowId}" style="${valStyle}" value="${escapeXml(displayText)}" vertex="1">\n`;
      xml += `          <mxGeometry x="${KEY_COL_WIDTH}" width="${VAL_COL_WIDTH}" height="${ROW_HEIGHT}" as="geometry">\n`;
      xml += `            <mxRectangle width="${VAL_COL_WIDTH}" height="${ROW_HEIGHT}" as="alternateBounds" />\n`;
      xml += `          </mxGeometry>\n`;
      xml += `        </mxCell>\n`;
    });
  });

  // Render Relationship Edges
  relationships.forEach((rel, index) => {
    const edgeId = `edge_${index + 1}`;
    const sourceTable = tableCells[rel.fromTable];
    const targetTable = tableCells[rel.toTable];

    if (!sourceTable || !targetTable) return;

    // Clean orthogonal Swiss lines with ER Crow's foot notation
    const edgeStyle = 'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;startArrow=ERone;startFill=0;endArrow=ERmany;endFill=0;strokeColor=#475569;strokeWidth=1.5;fontSize=10;fontColor=#1E293B;labelBackgroundColor=#FFFFFF;';

    xml += `        <mxCell id="${edgeId}" edge="1" parent="1" source="${sourceTable}" target="${targetTable}" style="${edgeStyle}" value="${escapeXml(rel.label)}">\n`;
    xml += `          <mxGeometry relative="1" as="geometry" />\n`;
    xml += `        </mxCell>\n`;
  });

  xml += '      </root>\n';
  xml += '    </mxGraphModel>\n';
  xml += '  </diagram>\n';
  xml += '</mxfile>\n';

  return xml;
}

const generatedXml = generateDrawioXml();
const targetPath = path.join(__dirname, '..', 'Airport_Management_System_UML.drawio');
fs.writeFileSync(targetPath, generatedXml, 'utf-8');
console.log(`Successfully generated drawio file at ${targetPath}. File size: ${generatedXml.length} bytes.`);
