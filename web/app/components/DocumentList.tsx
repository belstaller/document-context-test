'use client';

import { useEffect, useState } from 'react';

import styles from './DocumentList.module.css';

interface DocumentItem {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
}

export default function DocumentList() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app you'd get the userId from auth context.
    const DEMO_USER_ID = 'demo';
    fetch(`/api/users/${DEMO_USER_ID}/documents`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<DocumentItem[]>;
      })
      .then(setDocuments)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Failed to load documents.'),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className={styles.state}>Loading documents…</p>;
  }

  if (error) {
    return <p className={styles.stateError}>Error: {error}</p>;
  }

  if (documents.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No documents yet.</p>
        <p className={styles.hint}>Create your first document via the API.</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {documents.map((doc) => (
        <li key={doc.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.title}>{doc.title}</span>
            <span className={`${styles.badge} ${styles[`badge_${doc.status}`]}`}>{doc.status}</span>
          </div>
          <p className={styles.meta}>
            Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
