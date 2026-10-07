import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Spin } from 'antd';
import {
  ShoppingBag, Utensils, Smartphone, Shirt, Coffee,
  Apple, Pizza, Cake, Wine, Beef, Salad, IceCream,
  Sandwich, Package, Tag, Grid2X2, Star, Gem, Laptop,
  Watch, Headphones, Camera, BookOpen, Home, Dumbbell,
  Baby, Flower2, Car, Music, Gamepad2, Pill, Scissors,
} from 'lucide-react';
import styled from 'styled-components';
import CategoryService from '@services/CategoryService';

// ─── Constants ───────────────────────────────────────────────────────────────

const TEAL = '#14b8a6';
const LIMIT = 8; // how many categories to fetch per page

const CAT_COLORS = [
  '#7c6fc2', '#3dbdd4', '#e8388a', '#a47cd4',
  '#e8833a', '#e03a3a', '#d4a020', '#0b9e7f',
  '#3a7bd4', '#d43a8a', '#6cc24a', '#e05c3a',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Deterministic color from id — same id always returns same color
export const getCatColor = (id = '') => {
  const index = [...String(id)].reduce((acc, c) => acc + c.charCodeAt(0), 0) % CAT_COLORS.length;
  return CAT_COLORS[index];
};

// "All Menus" → "AM", "Phones" → "PH"
export const getCatInitials = (name = '') => {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

// Normalize API shape → internal shape
// API:      { id, name, icon, image, itemCount, ... }
// Internal: { id, name, icon, image, itemCount }
const normalizeCategory = (cat) => ({
  id:        cat.id,
  name:      cat.name      ?? cat.label ?? '',
  icon:      cat.icon      ?? null,
  image:     cat.image     ?? cat.icon_url ?? null,
  itemCount: cat.itemCount ?? cat.count   ?? 0,
});

// ─── Styled Components ───────────────────────────────────────────────────────

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
  overflow-x: auto;
  overflow-y: visible;
  scrollbar-width: none;
  padding: 2px 2px 8px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    scroll-snap-align: start;
  }
`;

const Tab = styled.button`
  height: 68px;
  min-width: 176px;
  max-width: 220px;
  padding: 0 16px 0 12px;
  border-radius: 18px;
  border: 1px solid ${({ $active }) => ($active ? '#99e6dc' : '#e5edf0')};
  background: ${({ $active }) => ($active ? '#f3fffc' : '#fff')};
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: ${({ $active }) =>
    $active ? `0 8px 20px rgba(20, 184, 166, 0.14)` : '0 4px 14px rgba(15, 23, 42, 0.04)'};
  transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;

  &:hover {
    border-color: ${TEAL};
    background: #f8fffd;
    box-shadow: 0 8px 20px rgba(20, 184, 166, 0.12);
    transform: translateY(-1px);
  }

  &:active {
    background: #d6f0ea;
    box-shadow: none;
  }
`;

const TabIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: ${({ $active }) => ($active ? '14px' : '50%')};
  background: ${({ $active, $color }) => ($active ? TEAL : $color || '#e0e0e0')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ $hasImage }) => ($hasImage ? 'inherit' : '12px')};
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  overflow: hidden;
  letter-spacing: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TabText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  min-width: 0;
`;

const TabName = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: ${({ $active }) => ($active ? '#0f766e' : '#0f172a')};
  line-height: 1.2;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TabCount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  line-height: 1.2;
  margin-top: 3px;
`;

const LoadMore = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  flex-shrink: 0;
`;

const CATEGORY_ICON_MAP = {
  food: Utensils,
  drink: Wine,
  drinks: Wine,
  coffee: Coffee,
  pizza: Pizza,
  burger: Beef,
  beef: Beef,
  cake: Cake,
  dessert: IceCream,
  snack: Sandwich,
  snacks: Sandwich,
  salad: Salad,
  fruit: Apple,
  fruits: Apple,
  beverage: Wine,
  beverages: Wine,
  meal: Utensils,
  meals: Utensils,
  phone: Smartphone,
  phones: Smartphone,
  laptop: Laptop,
  laptops: Laptop,
  electronics: Headphones,
  camera: Camera,
  watch: Watch,
  headphone: Headphones,
  shirt: Shirt,
  clothes: Shirt,
  clothing: Shirt,
  fashion: Shirt,
  bag: ShoppingBag,
  book: BookOpen,
  books: BookOpen,
  home: Home,
  sport: Dumbbell,
  sports: Dumbbell,
  gym: Dumbbell,
  baby: Baby,
  flower: Flower2,
  flowers: Flower2,
  car: Car,
  music: Music,
  game: Gamepad2,
  games: Gamepad2,
  health: Pill,
  beauty: Scissors,
  gem: Gem,
  jewelry: Gem,
  all: Grid2X2,
};

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * CategoryList
 *
 * Fetches its own data from CategoryService.getCategoriesPOS().
 * Always prepends an "All Menus" tab with totalProducts as its count.
 * Supports horizontal scroll with load-more (local pagination by default,
 * or server-driven if onLoadMore is passed).
 *
 * Props:
 *   totalProducts  {number}    Count shown on the "All" tab
 *   activeId       {string}    Controlled selected category id
 *   onChange       {Function}  Called with selected category id on tab click
 *   onLoadMore     {Function}  Optional async fn — called at right scroll edge
 *                              for server-side pagination; omit for local paging
 *   hasMore        {boolean}   Required only when onLoadMore is provided
 */
const CategoryList = ({
  totalProducts = 0,
  activeId,
  onChange,
}) => {
     const scrollRef     = useRef(null);
     const offsetRef     = useRef(0);        // always current, no stale closure
     const hasMoreRef    = useRef(true);     // always current, no stale closure
     const loadingRef    = useRef(false);    // guards against double-fetch
     const [categories,  setCategories]  = useState([]);
     const [loading,     setLoading]     = useState(true);
     const [loadingMore, setLoadingMore] = useState(false);

     // ── Fetch helpers ───────────────────────────────────────────────
     const ALL_TAB = useMemo(() => ({
          id:        'all',
          name:      'All Menus',
          icon:      '🏷️',
          image:     null,
          itemCount: totalProducts,
     }), [totalProducts]);

     const fetchCategories = useCallback((currentOffset, replace = false) => {
          return CategoryService.getCategoriesPOS({ limit: LIMIT, offset: currentOffset })
               .then((response) => {
               if (response?.data?.data) {
                    const normalized = response.data.data.map(normalizeCategory);

                    setCategories((prev) =>
                    replace ? [ALL_TAB, ...normalized] : [...prev, ...normalized]
                    );

                    // update refs immediately — no re-render needed, no stale closure risk
                    hasMoreRef.current  = normalized.length === LIMIT;
                    offsetRef.current   = currentOffset + normalized.length;
               }
               });
     }, [ALL_TAB]);

     // Initial fetch
     useEffect(() => {
          setLoading(true);
          fetchCategories(0, true).finally(() => setLoading(false));
     }, []);

     // Keep "All" tab count in sync with totalProducts
     useEffect(() => {
          setCategories((prev) =>
               prev.map((c) => (c.id === 'all' ? { ...c, itemCount: totalProducts } : c))
          );
     }, [totalProducts]);

     // ── Scroll handler ──────────────────────────────────────────────
     // Uses refs so it never captures stale offset/hasMore/loading values.
     // Registered once — no dependency array churn, no missed scroll events.
     const handleScroll = useCallback(() => {
          const el = scrollRef.current;
          if (!el || loadingRef.current || !hasMoreRef.current) return;

          const nearEnd = el.scrollWidth - el.scrollLeft - el.clientWidth < 80;
          if (!nearEnd) return;

          loadingRef.current = true;
          setLoadingMore(true);
          fetchCategories(offsetRef.current).finally(() => {
               loadingRef.current = false;
               setLoadingMore(false);
          });
     }, [fetchCategories]);

     /**
      * Returns a lucide icon component for a matched category name,
      * or null if no match — caller should fall back to initials text.
      */
     const getCatIcon = (name = '') => {
          const key = name.toLowerCase().trim();
          if (CATEGORY_ICON_MAP[key]) return CATEGORY_ICON_MAP[key];
          const matched = Object.keys(CATEGORY_ICON_MAP).find((k) => key.includes(k));
          return matched ? CATEGORY_ICON_MAP[matched] : null; // null = no match → use initials
     };

     useEffect(() => {
          if (loading) return;          // skeleton phase — skip

          const el = scrollRef.current; // now guaranteed to be the real Wrapper
          if (!el) return;
          el.addEventListener('scroll', handleScroll);

          return () => el.removeEventListener('scroll', handleScroll);
     }, [handleScroll, loading]);    // fires again when loading → false

     // ── Render ──────────────────────────────────────────────────────
     if (loading) {
          return (
               <Wrapper>
               {[...Array(5)].map((_, i) => (
                    <Tab key={i} style={{ opacity: 0.4, pointerEvents: 'none' }}>
                    <TabIcon $color="#e0e0e0" />
                    <TabText>
                    <TabName style={{ width: 60, height: 12, background: '#e0e0e0', borderRadius: 4 }} />
                    <TabCount style={{ width: 40, height: 10, background: '#ebebeb', borderRadius: 4, marginTop: 4 }} />
                    </TabText>
                    </Tab>
               ))}
               </Wrapper>
          );
     }

     return (
          <Wrapper ref={scrollRef}>
               {categories.map((cat) => {
               const isActive  = activeId === cat.id || (!activeId && cat.id === 'all');
               const hasImage  = !!cat.image;
               const CatIcon   = getCatIcon(cat.name); // null if no match

               return (
                    <Tab
                         key={cat.id}
                         $active={isActive}
                         onClick={() => onChange && onChange(cat.id)}
                    >
                         <TabIcon
                              $color={hasImage ? 'transparent' : getCatColor(cat.id)}
                              $hasImage={hasImage}
                              $active={isActive}
                         >
                              {hasImage
                                   ? <img src={cat.image} alt={cat.name} />
                                   : CatIcon
                                        ? <CatIcon size={20} color="#fff" strokeWidth={2} />
                                        : getCatInitials(cat.name)   // ← fallback to initials
                              }
                         </TabIcon>
                         <TabText>
                              <TabName $active={isActive}>{cat.name}</TabName>
                              <TabCount>{cat.itemCount} Items</TabCount>
                         </TabText>
                    </Tab>
               );
               })}

               {loadingMore && (<LoadMore><Spin size="small" /></LoadMore>)}
          </Wrapper>
     );
};

export default CategoryList;
