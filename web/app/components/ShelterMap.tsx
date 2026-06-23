'use client';

import styles from './ShelterMap.module.css';

interface Props {
  latitude: number;
  longitude: number;
  shelterName: string;
}

/**
 * ShelterMap — embeds an OpenStreetMap tile via iframe.
 * No API key required. Uses the public OpenStreetMap export endpoint.
 */
export default function ShelterMap({ latitude, longitude, shelterName }: Props) {
  // Build a bounding box ~0.005° around the pin (~500 m)
  const delta = 0.005;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join(',');

  const src =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${encodeURIComponent(bbox)}` +
    `&layer=mapnik` +
    `&marker=${latitude},${longitude}`;

  return (
    <div className={styles.wrapper}>
      <iframe
        title={`Map showing location of ${shelterName}`}
        src={src}
        className={styles.frame}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <a
        className={styles.link}
        href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View larger map ↗
      </a>
    </div>
  );
}
