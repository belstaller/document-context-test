import Link from 'next/link';

import OperatingHours from '../../components/OperatingHours';
import ShelterMap from '../../components/ShelterMap';
import styles from './page.module.css';

type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

interface DayHours {
  open: string | null;
  close: string | null;
}

interface PetListing {
  id: string;
  name: string;
  species: string;
  breed: string;
  ageMonths: number;
  photos: string[];
  status: 'active' | 'archived';
}

interface Shelter {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string | null;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postcode: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  operatingHours: Partial<Record<DayOfWeek, DayHours>>;
}

interface Props {
  params: { id: string };
}

async function getShelter(id: string): Promise<Shelter | null> {
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
  const res = await fetch(`${apiUrl}/api/shelters/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json() as Promise<Shelter>;
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

function formatAge(months: number): string {
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years} yr ${rem} mo` : `${years} yr`;
}

export default async function ShelterProfilePage({ params }: Props) {
  const [shelter, allPets] = await Promise.all([
    getShelter(params.id),
    getShelterPets(params.id),
  ]);

  if (!shelter) {
    return (
      <main className={styles.main}>
        <p className={styles.error}>Shelter not found.</p>
        <Link href="/pets" className={styles.backLink}>
          ← Browse all pets
        </Link>
      </main>
    );
  }

  const activePets = allPets.filter((p) => p.status === 'active');
  const previewPets = activePets.slice(0, 6);

  const fullAddress = [
    shelter.addressLine1,
    shelter.addressLine2,
    shelter.city,
    shelter.state,
    shelter.postcode,
    shelter.country,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <main className={styles.main}>
      {/* ── Header ──────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{shelter.name}</h1>
          <address className={styles.address}>{fullAddress}</address>
        </div>
        <Link
          href={`/pets?shelterId=${shelter.id}`}
          className={styles.viewAllBtn}
        >
          View all pets →
        </Link>
      </header>

      {/* ── Body: two-column layout ───────────────────────── */}
      <div className={styles.body}>
        {/* Left column */}
        <div className={styles.left}>
          {/* Contact info */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Contact</h2>
            <ul className={styles.contactList}>
              <li>
                <span className={styles.contactLabel}>Phone</span>
                <a href={`tel:${shelter.phone}`} className={styles.contactValue}>
                  {shelter.phone}
                </a>
              </li>
              <li>
                <span className={styles.contactLabel}>Email</span>
                <a href={`mailto:${shelter.email}`} className={styles.contactValue}>
                  {shelter.email}
                </a>
              </li>
              {shelter.website && (
                <li>
                  <span className={styles.contactLabel}>Website</span>
                  <a
                    href={shelter.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactValue}
                  >
                    {shelter.website.replace(/^https?:\/\//, '')}
                  </a>
                </li>
              )}
            </ul>
          </section>

          {/* Operating hours */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Hours</h2>
            <OperatingHours operatingHours={shelter.operatingHours} />
          </section>
        </div>

        {/* Right column */}
        <div className={styles.right}>
          {/* Map */}
          {shelter.latitude !== null && shelter.longitude !== null ? (
            <section className={styles.card}>
              <h2 className={styles.cardTitle}>Location</h2>
              <ShelterMap
                latitude={shelter.latitude}
                longitude={shelter.longitude}
                shelterName={shelter.name}
              />
            </section>
          ) : (
            <section className={`${styles.card} ${styles.noMap}`}>
              <p className={styles.noMapText}>
                📍 {fullAddress}
              </p>
            </section>
          )}
        </div>
      </div>

      {/* ── Available pets ───────────────────────────────── */}
      <section className={styles.petsSection}>
        <div className={styles.petsSectionHeader}>
          <h2 className={styles.cardTitle}>
            Available Pets
            {activePets.length > 0 && (
              <span className={styles.petCount}>{activePets.length}</span>
            )}
          </h2>
          {activePets.length > previewPets.length && (
            <Link
              href={`/pets?shelterId=${shelter.id}`}
              className={styles.viewAllLink}
            >
              View all {activePets.length} pets →
            </Link>
          )}
        </div>

        {activePets.length === 0 ? (
          <div className={styles.emptyPets}>
            <p>No pets available at this shelter right now.</p>
            <p className={styles.hint}>Check back soon!</p>
          </div>
        ) : (
          <ul className={styles.petGrid}>
            {previewPets.map((pet) => (
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
                  <span className={styles.petMeta}>
                    {pet.species} · {pet.breed}
                  </span>
                  <span className={styles.petAge}>{formatAge(pet.ageMonths)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {activePets.length > previewPets.length && (
          <div className={styles.viewAllFooter}>
            <Link
              href={`/pets?shelterId=${shelter.id}`}
              className={styles.viewAllBtn}
            >
              View all {activePets.length} pets at {shelter.name} →
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
