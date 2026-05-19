import styles from './page.module.css';

interface Props {
  params: { id: string };
}

async function getDocument(id: string) {
  const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
  const res = await fetch(`${apiUrl}/api/documents/${id}`, {
    // Opt out of Next.js data cache for dynamic data.
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json() as Promise<{
    id: string;
    title: string;
    content: string;
    status: string;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export default async function DocumentPage({ params }: Props) {
  const document = await getDocument(params.id);

  if (!document) {
    return (
      <main className={styles.main}>
        <p className={styles.error}>Document not found.</p>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>{document.title}</h1>
        <div className={styles.meta}>
          <span className={styles.status}>{document.status}</span>
          <span className={styles.date}>
            Updated {new Date(document.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </header>

      <article className={styles.content}>
        <p>{document.content}</p>
      </article>
    </main>
  );
}
