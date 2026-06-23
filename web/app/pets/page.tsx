'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './page.module.css';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PetListing {
  id: string;
  shelterId: string;
  name: string;
  species: string;
  breed: string;
  ageMonths: number;
  vaccinated: boolean;
  neuteredOrSpayed: boolean;
  microchipped: boolean;
  photos: string[];
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface PetListingsPage {
  items: PetListing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Filters {
  species: string;
  breed: string;
  ageMin: string;
  ageMax: string;
  size: string;
}

const EMPTY_FILTERS: Filters = {
  species: '',
  breed: '',
  ageMin: '',
  ageMax: '',
  size: '',
};

const PAGE_SIZE = 12;

// ── Size helper ───────────────────────────────────────────────────────────────

/**
 * Derives a rough size bucket from species + ageMonths.
 * Used for client-side size filtering since no explicit size column exists.
 */
function derivedSize(listing: PetListing): 'small' | 'medium' | 'large' {
  const s = listing.species.toLowerCase();
  const months = listing.ageMonths;

  if (s === 'cat' || s === 'rabbit' || s === 'hamster' || s === 'guinea pig') return 'small';
  if (s === 'dog') {
    // Rough heuristic: puppies grow, adult dogs vary; default medium
    if (months < 6) return 'small';
    return 'medium';
  }
  if (months < 3) return 'small';
  if (months < 24) return 'medium';
  return 'large';
}

// ── Age formatter ─────────────────────────────────────────────────────────────

function formatAge(months: number): string {
  if (months < 1) return 'Under 1 month';
  if (months < 12) return `${months} month${months === 1 ? '' : 's'}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years} year${years === 1 ? '' : 's'}`;
  return `${years}y ${rem}m`;
}

// ── Species emoji ─────────────────────────────────────────────────────────────

function speciesEmoji(species: string): string {
  switch (species.toLowerCase()) {
    case 'dog': return '🐶';
    case 'cat': return '🐱';
    case 'rabbit': return '🐰';
    case 'bird': return '🐦';
    case 'hamster': return '🐹';
    case 'fish': return '🐠';
    default: return '🐾';
  }
}

// ── Skeleton loader ───────────────────────────────────────────────────────────

function SkeletonGrid() {
  return (
    <div className={styles.loadingGrid}>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonPhoto} />
          <div className={styles.skeletonBody}>
            <div className={`${styles.skeletonLine} ${styles.medium}`} />
            <div className={`${styles.skeletonLine} ${styles.short}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PetsPage() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PetListingsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce text inputs so we don't fire on every keystroke
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(EMPTY_FILTERS);

  // When filters change, reset page and debounce the API call
  useEffect(() => {
    setPage(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filters]);

  // Fetch from the API
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(PAGE_SIZE));
      if (debouncedFilters.species) params.set('species', debouncedFilters.species);
      if (debouncedFilters.breed) params.set('breed', debouncedFilters.breed);
      if (debouncedFilters.ageMin) params.set('ageMin', debouncedFilters.ageMin);
      if (debouncedFilters.ageMax) params.set('ageMax', debouncedFilters.ageMax);

      const res = await fetch(`/api/pets?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as PetListingsPage;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pets.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedFilters]);

  useEffect(() => {
    void fetchListings();
  }, [fetchListings]);

  // Client-side size filter applied on top of API results
  const visibleItems =
    data?.items.filter((pet) => {
      if (!debouncedFilters.size) return true;
      return derivedSize(pet) === debouncedFilters.size;
    }) ?? [];

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters(EMPTY_FILTERS);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Find Your Perfect Pet</h1>
        <p className={styles.subtitle}>Browse available animals from shelters near you</p>
      </header>

      <div className={styles.layout}>
        {/* Filter panel */}
        <aside className={styles.filters}>
          <div className={styles.filtersTitle}>
            Filters
            {hasActiveFilters && (
              <button className={styles.resetBtn} onClick={handleReset} type="button">
                Reset all
              </button>
            )}
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="filter-species">
              Species
            </label>
            <select
              id="filter-species"
              className={styles.filterSelect}
              value={filters.species}
              onChange={(e) => handleFilterChange('species', e.target.value)}
            >
              <option value="">All species</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="rabbit">Rabbit</option>
              <option value="bird">Bird</option>
              <option value="hamster">Hamster</option>
              <option value="fish">Fish</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="filter-breed">
              Breed
            </label>
            <input
              id="filter-breed"
              type="text"
              className={styles.filterInput}
              placeholder="e.g. Labrador"
              value={filters.breed}
              onChange={(e) => handleFilterChange('breed', e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Age range</span>
            <div className={styles.ageRow}>
              <input
                type="number"
                className={styles.filterInput}
                placeholder="Min mo."
                min={0}
                value={filters.ageMin}
                onChange={(e) => handleFilterChange('ageMin', e.target.value)}
                aria-label="Minimum age in months"
              />
              <input
                type="number"
                className={styles.filterInput}
                placeholder="Max mo."
                min={0}
                value={filters.ageMax}
                onChange={(e) => handleFilterChange('ageMax', e.target.value)}
                aria-label="Maximum age in months"
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel} htmlFor="filter-size">
              Size
            </label>
            <select
              id="filter-size"
              className={styles.filterSelect}
              value={filters.size}
              onChange={(e) => handleFilterChange('size', e.target.value)}
            >
              <option value="">Any size</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </aside>

        {/* Results */}
        <section className={styles.results}>
          {/* Results bar */}
          {!loading && !error && data && (
            <div className={styles.resultsBar}>
              <span className={styles.resultCount}>
                {debouncedFilters.size
                  ? `${visibleItems.length} result${visibleItems.length === 1 ? '' : 's'} (filtered)`
                  : `${data.total} pet${data.total === 1 ? '' : 's'} available`}
              </span>
              {data.totalPages > 1 && (
                <span>
                  Page {data.page + 1} of {data.totalPages}
                </span>
              )}
            </div>
          )}

          {/* Loading state */}
          {loading && <SkeletonGrid />}

          {/* Error state */}
          {!loading && error && (
            <p className={styles.stateError}>⚠ {error}</p>
          )}

          {/* Pet grid */}
          {!loading && !error && (
            <>
              {visibleItems.length === 0 ? (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>🐾</div>
                  <p>No pets match your filters.</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  {visibleItems.map((pet) => (
                    <article key={pet.id} className={styles.card}>
                      <div className={styles.photoWrap}>
                        {pet.photos.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            className={styles.photo}
                            src={pet.photos[0]}
                            alt={`Photo of ${pet.name}`}
                            loading="lazy"
                          />
                        ) : (
                          <span className={styles.photoPlaceholder} aria-hidden="true">
                            {speciesEmoji(pet.species)}
                          </span>
                        )}
                      </div>
                      <div className={styles.cardBody}>
                        <p className={styles.petName}>{pet.name}</p>
                        <p className={styles.petBreed}>{pet.breed}</p>
                        <p className={styles.petAge}>{formatAge(pet.ageMonths)}</p>
                        <span className={styles.speciesBadge}>{pet.species}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <nav className={styles.pagination} aria-label="Pagination">
                  <button
                    className={styles.pageBtn}
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    type="button"
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: Math.min(data.totalPages, 7) }, (_, i) => {
                    // Show pages around current, always first/last
                    const total = data.totalPages;
                    let pageNum: number;
                    if (total <= 7) {
                      pageNum = i;
                    } else if (page <= 3) {
                      pageNum = i < 6 ? i : total - 1;
                    } else if (page >= total - 4) {
                      pageNum = i === 0 ? 0 : total - 7 + i;
                    } else {
                      const offsets = [0, page - 2, page - 1, page, page + 1, page + 2, total - 1];
                      pageNum = offsets[i] ?? i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`${styles.pageBtn}${pageNum === page ? ` ${styles.active}` : ''}`}
                        onClick={() => setPage(pageNum)}
                        type="button"
                        aria-current={pageNum === page ? 'page' : undefined}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}

                  <button
                    className={styles.pageBtn}
                    disabled={data === null || page >= data.totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    type="button"
                  >
                    Next →
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
