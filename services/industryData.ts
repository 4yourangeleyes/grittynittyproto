import { InvoiceItem, TemplateBlock, DocType, Client, DocumentData } from '../types';

export const INDUSTRIES = [
  'Plumber',
  'Mechanic',
  'Catering',
  'Carpenter',
  'Construction'
];

// Helper to generate massive item lists for 5-page invoices
const generateMassiveItems = (industry: string): InvoiceItem[] => {
  const items: InvoiceItem[] = [];
  const baseItems = {
    'Plumber': [
      { desc: 'Copper Pipe 15mm (Class 0)', price: 45, unit: 'm' },
      { desc: 'Elbow Joint 15mm', price: 12, unit: 'ea' },
      { desc: 'Solder Ring', price: 5, unit: 'ea' },
      { desc: 'Labor: Rough-in', price: 450, unit: 'hrs' },
      { desc: 'Labor: Finishing', price: 450, unit: 'hrs' },
      { desc: 'Safety Valve Pressure Test', price: 150, unit: 'ea' },
      { desc: 'Geyser Installation Kit', price: 850, unit: 'set' },
      { desc: 'Flux & Solder Consumables', price: 120, unit: 'lot' }
    ],
    'Mechanic': [
      { desc: 'Synthetic Oil 5W-30', price: 180, unit: 'L' },
      { desc: 'Oil Filter (OEM)', price: 250, unit: 'ea' },
      { desc: 'Brake Pads (Front Set)', price: 890, unit: 'set' },
      { desc: 'Brake Discs Skimming', price: 450, unit: 'ea' },
      { desc: 'Labor: Service', price: 650, unit: 'hrs' },
      { desc: 'Diagnostic Scan', price: 550, unit: 'ea' },
      { desc: 'Spark Plugs (Iridium)', price: 220, unit: 'ea' },
      { desc: 'Windscreen Washer Fluid', price: 45, unit: 'ea' }
    ],
    'Catering': [
      { desc: 'Platter: Savory Mix', price: 450, unit: 'ea' },
      { desc: 'Platter: Sweet Treats', price: 380, unit: 'ea' },
      { desc: 'Waitstaff Service', price: 120, unit: 'hrs' },
      { desc: 'Chafing Dish Rental', price: 150, unit: 'ea' },
      { desc: 'Cutlery & Crockery Set', price: 15, unit: 'set' },
      { desc: 'Delivery & Setup', price: 550, unit: 'ea' },
      { desc: 'Beverage Station', price: 1200, unit: 'ea' },
      { desc: 'Ice Bags (5kg)', price: 25, unit: 'ea' }
    ],
    'Carpenter': [
      { desc: 'Meranti Timber 22x144', price: 180, unit: 'm' },
      { desc: 'Wood Glue (Industrial)', price: 120, unit: 'L' },
      { desc: 'Labor: Joinery', price: 550, unit: 'hrs' },
      { desc: 'Varnish (Marine Grade)', price: 350, unit: 'L' },
      { desc: 'Sandpaper Consumables', price: 85, unit: 'lot' },
      { desc: 'Hinges (Brass)', price: 65, unit: 'ea' },
      { desc: 'Handles (Brushed Steel)', price: 120, unit: 'ea' },
      { desc: 'Installation', price: 550, unit: 'hrs' }
    ],
    'Construction': [
      { desc: 'Cement (50kg Strength)', price: 110, unit: 'bag' },
      { desc: 'Building Sand', price: 850, unit: 'm3' },
      { desc: 'Bricks (Clay Stock)', price: 3.5, unit: 'ea' },
      { desc: 'Labor: Bricklaying', price: 350, unit: 'hrs' },
      { desc: 'Labor: General', price: 250, unit: 'hrs' },
      { desc: 'Scaffolding Rental', price: 1200, unit: 'day' },
      { desc: 'Safety Netting', price: 450, unit: 'm' },
      { desc: 'Site Clearing', price: 2500, unit: 'lot' }
    ]
  };

  const industryItems = baseItems[industry as keyof typeof baseItems] || baseItems['Plumber'];
  
  // Generate 80 items to ensure 5 pages
  for (let i = 0; i < 80; i++) {
    const template = industryItems[i % industryItems.length];
    items.push({
      id: `item_${i}_${Date.now()}`,
      description: `${template.desc} - Batch ${Math.floor(i / 8) + 1} (Ref: ${Math.random().toString(36).substring(7).toUpperCase()})`,
      quantity: Math.floor(Math.random() * 10) + 1,
      unitType: template.unit,
      price: template.price
    });
  }

  return items;
};

export const getIndustryTemplates = (industry: string): TemplateBlock[] => {
  const templates: TemplateBlock[] = [];
  
  // Special handling for Plumber industry - add comprehensive plumbing templates
  if (industry === 'Plumber') {
    // 1. REMOVAL
    templates.push({
      id: 'plumb-rem-1',
      name: '1. REMOVAL',
      category: 'Removal',
      type: DocType.INVOICE,
      items: [
        { id: 'r1', description: 'Removal of the wall hung toilet, concealed system', quantity: 1, unitType: 'ea', price: 1500 },
        { id: 'r2', description: 'Removal of the toilet', quantity: 1, unitType: 'ea', price: 550 },
        { id: 'r3', description: 'Removal of the flush master mechanism', quantity: 1, unitType: 'ea', price: 1800 },
        { id: 'r4', description: 'Removal of the Freestanding Bathtub and bath mixer taps', quantity: 1, unitType: 'ea', price: 1150 },
        { id: 'r5', description: 'Removal of the Bathtub, bath mixer taps and wall under the bathtub', quantity: 1, unitType: 'ea', price: 2850 },
        { id: 'r6', description: 'Removal of the double basin', quantity: 1, unitType: 'ea', price: 650 },
        { id: 'r7', description: 'Removal of the basin', quantity: 1, unitType: 'ea', price: 750 },
        { id: 'r8', description: 'Removal of the sink', quantity: 1, unitType: 'ea', price: 550 },
        { id: 'r9', description: 'Removal of the double sink', quantity: 1, unitType: 'ea', price: 750 },
        { id: 'r10', description: 'Removal of the cupboards', quantity: 1, unitType: 'ea', price: 600 },
        { id: 'r11', description: 'Removal of the single brick wall', quantity: 1, unitType: 'ea', price: 1800 },
        { id: 'r12', description: 'Removal of the double brick wall', quantity: 1, unitType: 'ea', price: 2500 },
        { id: 'r13', description: 'Removal of the false ceiling and downlights', quantity: 1, unitType: 'ea', price: 650 },
        { id: 'r14', description: 'Removal of the shower screen fixed panel', quantity: 1, unitType: 'ea', price: 400 },
        { id: 'r15', description: 'Removal of the shower arm and wallplate', quantity: 1, unitType: 'ea', price: 350 },
        { id: 'r16', description: 'Removal of the shower floor', quantity: 1, unitType: 'ea', price: 1450 },
        { id: 'r17', description: 'Removal of the shower door and fix panel', quantity: 1, unitType: 'ea', price: 550 },
        { id: 'r18', description: 'Removal of the Frameless shower enclosure', quantity: 1, unitType: 'ea', price: 650 },
        { id: 'r19', description: 'Removal of the shower enclosure', quantity: 1, unitType: 'ea', price: 550 },
        { id: 'r20', description: 'Removal of the shower mixer, shower outlet and shower hand set', quantity: 1, unitType: 'ea', price: 550 },
        { id: 'r21', description: 'Removal of the concrete and tiled shower seat', quantity: 1, unitType: 'ea', price: 1000 },
        { id: 'r22', description: 'Removal of the bathroom door', quantity: 1, unitType: 'ea', price: 150 },
        { id: 'r23', description: 'Removal of the cornices', quantity: 1, unitType: 'm', price: 120 },
        { id: 'r24', description: 'Removal of the walls tiles', quantity: 1, unitType: 'sqm', price: 150 },
        { id: 'r25', description: 'Removal of the floor tiles', quantity: 1, unitType: 'sqm', price: 200 },
        { id: 'r26', description: 'Removal of the floor mosaic tiles', quantity: 1, unitType: 'sqm', price: 200 },
        { id: 'r27', description: 'Removal of the floor screed', quantity: 1, unitType: 'sqm', price: 250 },
      ]
    });

    // 2. WATER SUPPLY PIPES - GEYSER
    templates.push({
      id: 'plumb-water-geyser',
      name: '2.1 WATER SUPPLY - GEYSER',
      category: 'Water Supply',
      type: DocType.INVOICE,
      items: [
        { id: 'g1', description: 'Labour (Removal of previous/Installation of new)', quantity: 1, unitType: 'ea', price: 650 },
        { id: 'g2', description: 'Geyser Kwikot 600 kPA 150 Litres Dual superline 5 years warranty (Safety valve/drain cock included)', quantity: 1, unitType: 'ea', price: 3400 },
        { id: 'g3', description: 'Geyser Kwikot 400 kPA 150 Litres Dual superline', quantity: 1, unitType: 'ea', price: 3400 },
        { id: 'g4', description: 'Geyser Kwikot 400 kPA 100 Litres Dual superline', quantity: 1, unitType: 'ea', price: 3400 },
        { id: 'g5', description: 'Custom galvanised Drip Tray 150 Litres vertical 600mmx680mm', quantity: 1, unitType: 'ea', price: 580 },
        { id: 'g6', description: 'Drip Tray plastic 150/200 Litres horizontal', quantity: 1, unitType: 'ea', price: 260 },
        { id: 'g7', description: 'Wood board and brackets to sustained the drip tray', quantity: 1, unitType: 'ea', price: 250 },
        { id: 'g8', description: 'Rawl-bolts', quantity: 1, unitType: 'ea', price: 25 },
        { id: 'g9', description: 'Kwikot 600 kPa pressure control cartridge', quantity: 1, unitType: 'ea', price: 700 },
        { id: 'g10', description: 'Kwikot 400 kPa pressure control cartridge', quantity: 1, unitType: 'ea', price: 700 },
        { id: 'g11', description: 'Kwikot 600 kPa expansion relief valve cartridge', quantity: 1, unitType: 'ea', price: 175 },
        { id: 'g12', description: 'Kwikot 400 kPa expansion relief valve cartridge', quantity: 1, unitType: 'ea', price: 215 },
        { id: 'g13', description: 'Multi Pressure control and relief Valve 400 kPA CxC 22mm', quantity: 1, unitType: 'ea', price: 950 },
        { id: 'g14', description: 'Vacuum breaker kwikot diam 22mm', quantity: 1, unitType: 'ea', price: 175 },
        { id: 'g15', description: 'Package : Copper (pipes 22mm Class 1/0, fittings, soldering)', quantity: 1, unitType: 'ea', price: 1500 },
        { id: 'g16', description: 'Lagging the copper pipes around the geyser (4ml)', quantity: 1, unitType: 'ea', price: 120 },
        { id: 'g17', description: 'Package : 40mm PVC pipe, fittings and glue for drip tray connection', quantity: 1, unitType: 'ea', price: 450 },
        { id: 'g18', description: 'Installation of a 22mm non-return valve on the hot water supply pipe', quantity: 1, unitType: 'ea', price: 750 },
      ]
    });

    // 2.2-2.8 WATER SUPPLY - OTHER POINTS
    templates.push({
      id: 'plumb-water-points',
      name: '2.2 WATER SUPPLY - BASIN/BATH/SHOWER/TOILET',
      category: 'Water Supply',
      type: DocType.INVOICE,
      items: [
        { id: 'b1', description: 'Cold and Hot Water for the Basin : 2Pts (Pex-alumi 15mm into wall, patching chases)', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'db1', description: 'Cold and Hot Water for the double Basin : 4Pts (Pex-alumi 15mm into wall, patching chases)', quantity: 1, unitType: 'ea', price: 1250 },
        { id: 'bem1', description: 'Cold and Hot Water for the Bath Mixer : 2Pts (Pex-alumi 22mm into wall, connection/installation)', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'bcm1', description: 'Cold and Hot Water for the Bath Mixer : 2Pts (Mixed water for sprout, piping 22mm/15mm)', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'sw1', description: 'Cold and Hot Water for the Shower Mixer : 2Pts (Pex-alumi 15mm)', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'sw2', description: 'Undertile stop taps and shower head points', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'tb1', description: 'Cold water for Concealed toilet system (1pt)', quantity: 1, unitType: 'ea', price: 3850 },
        { id: 'tb2', description: 'Cold water for Concealed toilet system (Alternative 1pt)', quantity: 1, unitType: 'ea', price: 2450 },
        { id: 'tb3', description: 'Cold water for the cistern (Close-coupled 1pt)', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'tb4', description: 'Hot and Cold water for the bidet mixer (2Pts)', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'tb5', description: 'Cold water for WC bidet sprayer (1Pt)', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'kl1', description: 'Hot and Cold water for the sink mixer (2Pts)', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'kl2', description: 'Cold water for the washing machine tap (1Pts)', quantity: 1, unitType: 'ea', price: 1850 },
      ]
    });

    // 3. DRAIN PIPES
    templates.push({
      id: 'plumb-drain-3',
      name: '3. DRAIN PIPES',
      category: 'Drain Pipes',
      type: DocType.INVOICE,
      items: [
        { id: 'dp1', description: 'Double Basin: PVC Pipe underground diam 40mm & Installation', quantity: 1, unitType: 'ea', price: 600 },
        { id: 'dp2', description: 'Basin: PVC Pipe underground diam 40mm & Installation', quantity: 1, unitType: 'ea', price: 600 },
        { id: 'dp3', description: 'Bath: PVC Pipe underground diam 40mm & Installation', quantity: 1, unitType: 'ea', price: 600 },
        { id: 'dp4', description: 'Walk-in Shower: PVC Pipe underground diam 40mm & Installation', quantity: 1, unitType: 'ea', price: 800 },
        { id: 'dp5', description: 'Shower Trap: Installation of the Shower Trap', quantity: 1, unitType: 'ea', price: 850 },
        { id: 'dp6', description: 'Wall-Hung Toilet: PVC Pipe underground 110mm', quantity: 1, unitType: 'ea', price: 1000 },
        { id: 'dp7', description: 'Close-Coupled Toilet: PVC Pipe underground 110mm (pan connector)', quantity: 1, unitType: 'ea', price: 1200 },
        { id: 'dp8', description: 'Wall-Hung Bidet: PVC Pipe underground diam 40mm', quantity: 1, unitType: 'ea', price: 600 },
        { id: 'dp9', description: 'Sink: PVC Pipe underground diam 40mm (into wall/exposed)', quantity: 1, unitType: 'ea', price: 600 },
        { id: 'dp10', description: 'Washing Machine: PVC Pipe underground diam 40mm (into wall/exposed)', quantity: 1, unitType: 'ea', price: 600 },
      ]
    });

    // 4. INSTALLATIONS - BASINS & BATHS
    templates.push({
      id: 'plumb-inst-basins',
      name: '4.1 INSTALLATIONS - BASINS & BATHS',
      category: 'Installations',
      type: DocType.INVOICE,
      items: [
        { id: 'ins1', description: 'Installation of the basin vanity (with silicone/mixer/waste/trap/valves)', quantity: 1, unitType: 'ea', price: 2400 },
        { id: 'ins2', description: 'Basin Installation (Fixation onto wall, mixer, waste, trap)', quantity: 1, unitType: 'ea', price: 2000 },
        { id: 'ins3', description: 'Double Basin and Vanity Installation', quantity: 1, unitType: 'ea', price: 3200 },
        { id: 'ins4', description: 'Built-in Bath Installation (75/32mm beam, sprout, overflow, light concrete mix)', quantity: 1, unitType: 'ea', price: 2500 },
        { id: 'ins5', description: 'Creation of a wall under the front of the bathtub', quantity: 1, unitType: 'ea', price: 2500 },
        { id: 'ins6', description: 'Bath Screen installation', quantity: 1, unitType: 'ea', price: 400 },
        { id: 'ins7', description: 'Free-standing Bath Installation', quantity: 1, unitType: 'ea', price: 3000 },
      ]
    });

    // 4.3 INSTALLATIONS - SHOWERS
    templates.push({
      id: 'plumb-inst-showers',
      name: '4.2 INSTALLATIONS - SHOWERS',
      category: 'Installations',
      type: DocType.INVOICE,
      items: [
        { id: 'ins8', description: 'Walk-in Shower Creation (Concrete mix, 1:30 gradient, brick layer border)', quantity: 1, unitType: 'ea', price: 2300 },
        { id: 'ins9', description: 'Waterproofing Membrane (Cemflex and Sika)', quantity: 1, unitType: 'ea', price: 360 },
        { id: 'ins10', description: 'Installation of the Shower Screen', quantity: 1, unitType: 'ea', price: 650 },
        { id: 'ins11', description: 'Installation of a Shower Enclosure', quantity: 1, unitType: 'ea', price: 1200 },
        { id: 'ins12', description: 'Monitoring installation of Frameless shower enclosure', quantity: 1, unitType: 'ea', price: 450 },
        { id: 'ins13', description: 'Installation of Shower Mixer after tiling', quantity: 1, unitType: 'ea', price: 400 },
        { id: 'ins14', description: 'Installation of Shower Arm and head', quantity: 1, unitType: 'ea', price: 350 },
        { id: 'ins15', description: 'Installation of Hand Shower outlet', quantity: 1, unitType: 'ea', price: 400 },
      ]
    });

    // 4.4 INSTALLATIONS - TOILETS & BIDETS
    templates.push({
      id: 'plumb-inst-toilets',
      name: '4.3 INSTALLATIONS - TOILETS & BIDETS',
      category: 'Installations',
      type: DocType.INVOICE,
      items: [
        { id: 'ins16', description: 'Wall-Hung WC into the wall Installation (Pan/Seat/Flush Plate)', quantity: 1, unitType: 'ea', price: 1650 },
        { id: 'ins17', description: 'Creation of brick wall around concealed toilet system and plastering', quantity: 1, unitType: 'ea', price: 3500 },
        { id: 'ins18', description: 'WC Bidet Spayer Installation (Angle valve/holder)', quantity: 1, unitType: 'ea', price: 550 },
        { id: 'ins19', description: 'Close-Coupled Toilet Installation (Cistern/Pan/Seat/Tap)', quantity: 1, unitType: 'ea', price: 1650 },
        { id: 'ins20', description: 'Wall-Hung Bidet Installation (Fixations/Trap/Mixer/Waste/Valves)', quantity: 1, unitType: 'ea', price: 3500 },
        { id: 'ins21', description: 'Sink Installation (Sealant/Mixer/Waste/Trap/Valves)', quantity: 1, unitType: 'ea', price: 1750 },
        { id: 'ins22', description: 'Washing Machine plumbing Installation (Angle valve/washer)', quantity: 1, unitType: 'ea', price: 750 },
        { id: 'ins23', description: 'Towel Heater Installation (connecting to electrical box)', quantity: 1, unitType: 'ea', price: 650 },
      ]
    });

    // 5. MASONRY & BUILDING
    templates.push({
      id: 'plumb-mas-5',
      name: '5. MASONRY & BUILDING',
      category: 'Masonry',
      type: DocType.INVOICE,
      items: [
        { id: 'mas1', description: 'Levelled concrete screed floor (after bathtub removal)', quantity: 1, unitType: 'ea', price: 600 },
        { id: 'mas2', description: 'Concrete screed (after floor tile removal)', quantity: 1, unitType: 'ea', price: 600 },
        { id: 'mas3', description: 'Self-levelling screed (Thin layer 3mm/m²)', quantity: 1, unitType: 'ea', price: 200 },
        { id: 'mas4', description: 'Self-levelling screed (Thin layer 6mm/m²)', quantity: 1, unitType: 'ea', price: 340 },
        { id: 'mas5', description: 'Self-levelling screed (Thin layer 9mm/m²)', quantity: 1, unitType: 'ea', price: 440 },
        { id: 'mas6', description: 'Wall shampoo Recess in shower (Removal of brick/Level/Plaster)', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'mas7', description: 'Nib Wall (Erect single brick layer)', quantity: 1, unitType: 'ea', price: 2500 },
        { id: 'mas8', description: 'Single Wall (Erect single brick layer)', quantity: 1, unitType: 'ea', price: 2250 },
        { id: 'mas9', description: 'Double Wall (Seat in shower)', quantity: 1, unitType: 'ea', price: 3500 },
        { id: 'mas10', description: 'Shower seat (Double brick layer)', quantity: 1, unitType: 'ea', price: 4000 },
        { id: 'mas11', description: 'Boxing for toilet drain pipes (Concrete mix and bricks)', quantity: 1, unitType: 'ea', price: 1500 },
        { id: 'mas12', description: 'Boxing for pipes (Nutec fiber cement board)', quantity: 1, unitType: 'ea', price: 1800 },
      ]
    });

    // 6. TILING
    templates.push({
      id: 'plumb-tile-6',
      name: '6. TILING',
      category: 'Tiling',
      type: DocType.INVOICE,
      items: [
        { id: 'til1', description: 'Mosaic Tiling', quantity: 1, unitType: 'sqm', price: 1250 },
        { id: 'til2', description: 'Wall Tiling (Shower area up to 2.0mL H)', quantity: 1, unitType: 'sqm', price: 320 },
        { id: 'til3', description: 'Tile edge trim installation', quantity: 1, unitType: 'ea', price: 70 },
        { id: 'til4', description: 'Floor Tiling (300x300mm or bigger)', quantity: 1, unitType: 'sqm', price: 320 },
        { id: 'til5', description: 'Skirting tiles Cutting and Installation', quantity: 1, unitType: 'm', price: 80 },
        { id: 'til6', description: 'Skirting tiles (Blue masking tape/Painters mate)', quantity: 1, unitType: 'ea', price: 50 },
      ]
    });

    // 7. CEILING & PARTITIONING
    templates.push({
      id: 'plumb-ceil-7',
      name: '7. CEILING & PARTITIONING',
      category: 'Ceiling',
      type: DocType.INVOICE,
      items: [
        { id: 'ceil1', description: 'Partition wall installation (Frame/Struds/Plasterboards)', quantity: 1, unitType: 'ea', price: 1400 },
        { id: 'ceil2', description: 'False ceiling installation (Frame/Struds/Plasterboards)', quantity: 1, unitType: 'ea', price: 900 },
        { id: 'ceil3', description: 'False ceiling installation Shadow line', quantity: 1, unitType: 'ea', price: 1000 },
        { id: 'ceil4', description: 'Jointing, Skimming (Rhinoglide/Tape/Skim coat)', quantity: 1, unitType: 'ea', price: 200 },
        { id: 'ceil5', description: 'Installation of new cornice for ceiling/wall', quantity: 1, unitType: 'ea', price: 120 },
      ]
    });

    // 8. ELECTRICAL
    templates.push({
      id: 'plumb-elec-8',
      name: '8. ELECTRICAL',
      category: 'Electrical',
      type: DocType.INVOICE,
      items: [
        { id: 'elec1', description: 'Bathroom Extractor Fan installation', quantity: 1, unitType: 'ea', price: 1050 },
        { id: 'elec2', description: 'Bathroom Extractor fan, false ceiling installation', quantity: 1, unitType: 'ea', price: 600 },
        { id: 'elec3', description: 'Mirror light junction box installation', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'elec4', description: 'Towel heater junction box installation', quantity: 1, unitType: 'ea', price: 2250 },
        { id: 'elec5', description: 'Downlight installation', quantity: 1, unitType: 'ea', price: 350 },
        { id: 'elec6', description: 'Downlight Unit (DL033/3 WHITE LED)', quantity: 1, unitType: 'ea', price: 250 },
        { id: 'elec7', description: 'Installation of a switch for the bathroom light', quantity: 1, unitType: 'ea', price: 1850 },
        { id: 'elec8', description: 'Installation of a dimmer and a switch for downlights', quantity: 1, unitType: 'ea', price: 650 },
        { id: 'elec9', description: 'Installation of a 4x2 Plug', quantity: 1, unitType: 'ea', price: 1750 },
        { id: 'elec10', description: 'Installation of a 4x4 Plug', quantity: 1, unitType: 'ea', price: 2050 },
      ]
    });

    // 9. PAINTING
    templates.push({
      id: 'plumb-paint-9',
      name: '9. PAINTING',
      category: 'Painting',
      type: DocType.INVOICE,
      items: [
        { id: 'pnt1', description: 'Paint Roller Set', quantity: 1, unitType: 'ea', price: 85 },
        { id: 'pnt2', description: 'Plascon White paint for bathroom and kitchen 2.5L/12.5m²', quantity: 1, unitType: 'ea', price: 550 },
        { id: 'pnt3', description: 'Apply 1 coat of primer paint, Ceiling and Walls', quantity: 1, unitType: 'sqm', price: 80 },
        { id: 'pnt4', description: 'Apply 2 coats of white paint finish, Ceiling and walls', quantity: 1, unitType: 'sqm', price: 140 },
        { id: 'pnt5', description: 'Apply 2 coats of colored paint finish, walls', quantity: 1, unitType: 'sqm', price: 180 },
        { id: 'pnt6', description: 'Painters mate applied between tiles and wall', quantity: 1, unitType: 'ea', price: 80 },
        { id: 'pnt7', description: 'Apply 2 coats of white paint finish, Door and/or Window', quantity: 1, unitType: 'ea', price: 350 },
      ]
    });

    // 10. CARPENTRY
    templates.push({
      id: 'plumb-carp-10',
      name: '10. CARPENTRY',
      category: 'Carpentry',
      type: DocType.INVOICE,
      items: [
        { id: 'carp1', description: 'Door Installation (Hinges/Handle)', quantity: 1, unitType: 'ea', price: 2500 },
        { id: 'carp2', description: 'Door material: Hard Board Hollow Core', quantity: 1, unitType: 'ea', price: 400 },
        { id: 'carp3', description: 'Decorwood zinc plated bar hinge set', quantity: 1, unitType: 'ea', price: 630 },
        { id: 'carp4', description: 'Architrave standard 70mmW x2400mmL', quantity: 1, unitType: 'ea', price: 90 },
        { id: 'carp5', description: 'Ceiling Trap Door Installation', quantity: 1, unitType: 'ea', price: 500 },
        { id: 'carp6', description: 'Ceiling trap door materials (610mmx610mm White)', quantity: 1, unitType: 'ea', price: 750 },
        { id: 'carp7', description: 'Wood Floating shelf for basin (900mmL x 500mmW)', quantity: 1, unitType: 'ea', price: 5000 },
        { id: 'carp8', description: 'Shelf installation', quantity: 1, unitType: 'ea', price: 2000 },
      ]
    });

    return templates;
  }
  
  // Default templates for other industries
  // 1. Standard Service Block
  templates.push({
    id: `temp_${industry}_1`,
    name: `${industry} Standard Service`,
    category: 'Services',
    type: DocType.INVOICE,
    items: [
      { id: '1', description: `Standard ${industry} Call-out Fee`, quantity: 1, unitType: 'ea', price: 550 },
      { id: '2', description: 'Labor Rate (Standard Hour)', quantity: 1, unitType: 'hrs', price: 450 }
    ]
  });

  // 2. Materials Block
  templates.push({
    id: `temp_${industry}_2`,
    name: `${industry} Materials Pack`,
    category: 'Materials',
    type: DocType.INVOICE,
    items: [
      { id: '3', description: 'Consumables & Sundries', quantity: 1, unitType: 'lot', price: 150 },
      { id: '4', description: 'Safety Equipment Surcharge', quantity: 1, unitType: 'ea', price: 85 }
    ]
  });

  // 3. Contract Clause
  templates.push({
    id: `temp_${industry}_3`,
    name: `${industry} Liability Waiver`,
    category: 'Legal',
    type: DocType.CONTRACT,
    clause: {
      id: 'c1',
      title: 'Liability Limitation',
      content: `The ${industry} shall not be liable for any pre-existing damage to the property or defects in materials supplied by the Client. Warranty on workmanship is valid for 6 months.`
    }
  });

  return templates;
};

export const getIndustryExampleInvoice = (industry: string, profileName: string): DocumentData => {
  const items = generateMassiveItems(industry);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15; // 15% VAT

  return {
    id: 'DEMO-5PAGE-001',
    type: DocType.INVOICE,
    status: 'Draft',
    title: `Comprehensive ${industry} Project (5-Page Demo)`,
    client: {
      id: 'demo_client',
      businessName: 'MegaCorp Developments',
      email: 'accounts@megacorp.demo',
      address: '123 Skyscraper Ave, Sandton, 2196',
      registrationNumber: '2025/123456/07'
    },
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'R',
    items: items,
    subtotal: subtotal,
    taxTotal: tax,
    total: subtotal + tax,
    vat_enabled: true,
    tax_rate: 15,
    notes: `This is a demonstration of a comprehensive 5-page invoice for the ${industry} industry. It contains ${items.length} line items to test pagination and performance.`
  };
};
