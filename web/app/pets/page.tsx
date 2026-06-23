import Link from 'next/link';

import styles from './page.module.css';

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
}

interface Shelter {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface Props {
  searchParams: { shelterId?: string };
}

async function getShelterPets(shelterId: string): Promise<PetListing[]> {
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
  const res = await fetch(
    `${apiUrl}/api/admin/shelters/${shelterId}/pet-listings`,
    { cache: 'no-store' },
  );
  if (!res.ok) return [];
  return res.json() as Promise<PetListing[]>;
}

async function getAllShelters(): Promise<Shelter[]> {
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
  const res = await fetch(`${apiUrl}/api/shelters`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json() as Promise<Shelter[]>;
}

async function getAllPets(shelters: Shelter[]): Promise<PetListing[]> {
  const lists = await Promise.all(shelters.map((s) => getShelterPets(s.id)));
  return lists.flat();
}

function formatAge(months: number): string {
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years} yr ${rem} mo` : `${years} yr`;
}

export default async function PetsPage({ searchParams }: Props) {
  const filterShelterId = searchParams.shelterId;

  const shelters = await getAllShelters();
  const filterShelter = filterShelterId
    ? shelters.find((s) => s.id === filterShelterId) ?? null
    : null;

  const rawPets = filterShelterId
    ? await getShelterPets(filterShelterId)
    : await getAllPets(shelters);

  const pets = rawPets.filter((p) => p.status === 'active');

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          {filterShelter ? (
            <>
              <Link href="/pets" className={styles.breadcrumbLink}>
                All Pets
              </Link>
              <span className={styles.breadcrumbSep}>›</span>
              <Link
                href={`/shelters/${filterShelter.id}`}
                className={styles.breadcrumbLink}
              >
                {filterShelter.name}
              </Link>
            </>
          ) : (
            <span>Browse Pets</span>
          )}
        </div>

        <h1 className={styles.title}>
          {filterShelter ? `Pets at ${filterShelter.name}` : 'Browse Adoptable Pets'}
        </h1>

        {filterShelter && (
          <p className={styles.subtitle}>
            {filterShelter.city}, {filterShelter.state} ·{' '}
            <Link href={`/shelters/${filterShelter.id}`} className={styles.shelterLink}>
              View shelter profile →
            </Link>
          </p>
        )}
      </header>

      {/* ── Shelter filter pills ────────────────────────────── */}
      {shelters.length > 0 && (
        <nav className={styles.filterNav} aria-label="Filter by shelter">
          <Link
            href="/pets"
            className={`${styles.filterPill} ${!filterShelterId ? styles.filterPillActive : ''}`}
          >
            All shelters
          </Link>
          {shelters.map((s) => (
            <Link
              key={s.id}
              href={`/pets?shelterId=${s.id}`}
              className={`${styles.filterPill} ${filterShelterId === s.id ? styles.filterPillActive : ''}`}
            >
              {s.name}
            </Link>
          ))}
        </nav>
      )}

      {/* ── Pet grid ────────────────────────────────────────── */}
      {pets.length === 0 ? (
        <div className={styles.empty}>
          <p>No pets available{filterShelter ? ` at ${filterShelter.name}` : ''} right now.</p>
          <p className={styles.hint}>Check back soon!</p>
          {filterShelterId && (
            <Link href="/pets" className={styles.resetLink}>
              Browse all pets →
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className={styles.resultCount}>
            {pets.length} {pets.length === 1 ? 'pet' : 'pets'} available
          </p>
          <ul className={styles.petGrid}>
            {pets.map((pet) => {
              const shelter = shelters.find((s) => s.id === pet.shelterId);
              return (
                <li key={pet.id} className={styles.petCard}>
                  {pet.photos.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pet.photos[0]}
                      alt={pet.name}
                      className={styles.petPhoto}
                    />
                  ) : (
                    <div className={styles.petPhotoPlaceholder}>🐾</div>
                  )}
                  <div className={styles.petInfo}>
                    <span className={styles.petName}>{pet.name}</span>
                    <span className={styles.petSpecies}>
                      {pet.species} · {pet.breed}
                    </span>
                    <span className={styles.petAge}>{formatAge(pet.ageMonths)}</span>
                    <div className={styles.petBadges}>
                      {pet.vaccinated && (
                        <span className={styles.badge}>Vaccinated</span>
                      )}
                      {pet.neuteredOrSpayed && (
                        <span className={styles.badge}>Neutered/Spayed</span>
                      )}
                      {pet.microchipped && (
                        <span className={styles.badge}>Microchipped</span>
                      )}
                    </div>
                    {shelter && (
                      <Link
                        href={`/shelters/${shelter.id}`}
                        className={styles.shelterTag}
                      >
                        📍 {shelter.name}
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}
