// map/data/shopsData.ts
// Hardware/Plumbing/Electrical store dummy data — spread around 15.76N 78.04E

export type StockStatus = 'inStock' | 'lowStock' | 'outOfStock';

export type InventoryItem = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: 'hardware' | 'plumbing' | 'electrical';
  emoji: string;
};

export type Shop = {
  id: string;
  name: string;
  address: string;
  distance: string;
  latitude: number;
  longitude: number;
  rating: number;
  inventory: InventoryItem[];
};

export type FilterCategory = 'all' | 'hardware' | 'plumbing' | 'electrical';

export const FILTER_TAGS: { key: FilterCategory; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '📍' },
  { key: 'hardware', label: 'Hardware', emoji: '🔨' },
  { key: 'plumbing', label: 'Plumbing', emoji: '🔧' },
  { key: 'electrical', label: 'Electrical', emoji: '⚡' },
];

// ─── 10 shops spread within ~1.5 km radius of 15.76, 78.04 ─────────────────
export const DUMMY_SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Metro Hardware & Supply',
    address: 'MG Road',
    distance: '0.3 km',
    latitude: 15.7618,
    longitude: 78.0415,
    rating: 4.8,
    inventory: [
      { id: '1a', name: 'PVC Pipe 2"', price: 120, stock: 24, category: 'plumbing', emoji: '🔧' },
      { id: '1b', name: 'LED Bulb 60W', price: 80, stock: 3, category: 'electrical', emoji: '💡' },
      { id: '1c', name: 'Copper Fitting', price: 60, stock: 45, category: 'plumbing', emoji: '🔩' },
      { id: '1d', name: 'Wire Nuts', price: 40, stock: 0, category: 'electrical', emoji: '⚡' },
    ],
  },
  {
    id: '2',
    name: 'BuildRight Pro Center',
    address: 'Station Rd',
    distance: '0.7 km',
    latitude: 15.7582,
    longitude: 78.0428,
    rating: 4.5,
    inventory: [
      { id: '2a', name: 'Hammer 16oz', price: 220, stock: 15, category: 'hardware', emoji: '🔨' },
      { id: '2b', name: 'Circuit Breaker', price: 180, stock: 2, category: 'electrical', emoji: '⚡' },
      { id: '2c', name: 'Pipe Wrench', price: 280, stock: 8, category: 'plumbing', emoji: '🔧' },
    ],
  },
  {
    id: '3',
    name: 'Downtown Electrical Supply',
    address: 'Market Street',
    distance: '1.1 km',
    latitude: 15.7640,
    longitude: 78.0368,
    rating: 4.9,
    inventory: [
      { id: '3a', name: 'Romex 14/2', price: 450, stock: 30, category: 'electrical', emoji: '🔌' },
      { id: '3b', name: 'Outlet Box', price: 30, stock: 1, category: 'electrical', emoji: '📦' },
      { id: '3c', name: 'GFCI Outlet', price: 150, stock: 12, category: 'electrical', emoji: '⚡' },
      { id: '3d', name: 'Toggle Switch', price: 50, stock: 50, category: 'electrical', emoji: '🔘' },
    ],
  },
  {
    id: '4',
    name: 'QuickFix Plumbing Depot',
    address: 'Gandhi Nagar',
    distance: '1.5 km',
    latitude: 15.7553,
    longitude: 78.0372,
    rating: 4.3,
    inventory: [
      { id: '4a', name: 'Toilet Flapper', price: 70, stock: 18, category: 'plumbing', emoji: '🚽' },
      { id: '4b', name: 'Faucet Aerator', price: 50, stock: 0, category: 'plumbing', emoji: '🚿' },
      { id: '4c', name: 'Teflon Tape', price: 30, stock: 100, category: 'plumbing', emoji: '🔧' },
    ],
  },
  {
    id: '5',
    name: 'AllTrade Hardware',
    address: 'Park Lane',
    distance: '1.8 km',
    latitude: 15.7655,
    longitude: 78.0458,
    rating: 4.6,
    inventory: [
      { id: '5a', name: 'Drill Bit Set', price: 320, stock: 7, category: 'hardware', emoji: '🔩' },
      { id: '5b', name: 'Socket Set', price: 480, stock: 4, category: 'hardware', emoji: '🔧' },
      { id: '5c', name: 'Safety Goggles', price: 120, stock: 22, category: 'hardware', emoji: '🥽' },
    ],
  },
  {
    id: '6',
    name: 'Ravi Electricals',
    address: 'Bus Stand Rd',
    distance: '0.5 km',
    latitude: 15.7600,
    longitude: 78.0442,
    rating: 4.4,
    inventory: [
      { id: '6a', name: 'Ceiling Fan', price: 1200, stock: 5, category: 'electrical', emoji: '🌀' },
      { id: '6b', name: 'MCB Switch', price: 90, stock: 40, category: 'electrical', emoji: '🔌' },
      { id: '6c', name: 'Extension Cord', price: 250, stock: 0, category: 'electrical', emoji: '⚡' },
    ],
  },
  {
    id: '7',
    name: 'Sri Venkateshwara Tools',
    address: 'Temple Rd',
    distance: '2.0 km',
    latitude: 15.7576,
    longitude: 78.0398,
    rating: 4.7,
    inventory: [
      { id: '7a', name: 'Angle Grinder', price: 1400, stock: 3, category: 'hardware', emoji: '🔩' },
      { id: '7b', name: 'Welding Rod', price: 200, stock: 60, category: 'hardware', emoji: '🔧' },
      { id: '7c', name: 'Tape Measure', price: 150, stock: 12, category: 'hardware', emoji: '📏' },
    ],
  },
  {
    id: '8',
    name: 'Sai Plumbing Works',
    address: 'Canal Road',
    distance: '1.3 km',
    latitude: 15.7635,
    longitude: 78.0480,
    rating: 4.2,
    inventory: [
      { id: '8a', name: 'Ball Valve 1\'\'', price: 180, stock: 20, category: 'plumbing', emoji: '🔧' },
      { id: '8b', name: 'Water Pump', price: 3500, stock: 2, category: 'plumbing', emoji: '💧' },
      { id: '8c', name: 'CPVC Pipe', price: 200, stock: 35, category: 'plumbing', emoji: '🔩' },
    ],
  },
  {
    id: '9',
    name: 'Power Zone Electricals',
    address: 'College Rd',
    distance: '2.4 km',
    latitude: 15.7548,
    longitude: 78.0440,
    rating: 4.6,
    inventory: [
      { id: '9a', name: 'LED Strip 5m', price: 450, stock: 8, category: 'electrical', emoji: '💡' },
      { id: '9b', name: 'Solar Panel', price: 12000, stock: 1, category: 'electrical', emoji: '☀️' },
      { id: '9c', name: 'DB Box', price: 600, stock: 6, category: 'electrical', emoji: '📦' },
    ],
  },
  {
    id: '10',
    name: 'Hanuman Hardware Mart',
    address: 'Old Market',
    distance: '0.9 km',
    latitude: 15.7670,
    longitude: 78.0405,
    rating: 4.5,
    inventory: [
      { id: '10a', name: 'Paint Brush Set', price: 280, stock: 18, category: 'hardware', emoji: '🖌️' },
      { id: '10b', name: 'Screw Driver Set', price: 350, stock: 0, category: 'hardware', emoji: '🔩' },
      { id: '10c', name: 'Cable Ties', price: 60, stock: 200, category: 'electrical', emoji: '🔗' },
    ],
  },
];

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'outOfStock';
  if (stock <= 5) return 'lowStock';
  return 'inStock';
}

export function getMinPrice(shop: Shop): number {
  return Math.min(...shop.inventory.map((i) => i.price));
}

export function getStockCounts(shop: Shop) {
  const inStock = shop.inventory.filter((i) => i.stock > 0).length;
  return { inStock, total: shop.inventory.length };
}

export function getMarkerDotColor(shop: Shop): string {
  const hasOut = shop.inventory.some((i) => i.stock === 0);
  const hasLow = shop.inventory.some((i) => i.stock > 0 && i.stock <= 5);
  if (hasOut && !shop.inventory.some((i) => i.stock > 5)) return '#ef4444';
  if (hasLow) return '#f59e0b';
  return '#22c55e';
}
