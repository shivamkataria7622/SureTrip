// map/index.ts
export { default as MapInventory } from './MapInventory';
export { default as MapShopView } from './components/MapShopView';
export { default as StoreCard } from './components/StoreCard';
export { default as SearchBar } from './components/SearchBar';
export { default as TagFilter } from './components/TagFilter';
export {
  DUMMY_SHOPS,
  FILTER_TAGS,
  getStockStatus,
  getMinPrice,
  getStockCounts,
  getMarkerDotColor,
} from './data/shopsData';
export type { Shop, InventoryItem, StockStatus, FilterCategory } from './data/shopsData';
