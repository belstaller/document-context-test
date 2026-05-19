import DocumentList from './components/DocumentList';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>document context test</h1>
        <p className={styles.subtitle}>
          A document management platform built with Next.js, PostgreSQL, and Python microservices.
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Documents</h2>
        <DocumentList />
      </section>

      <footer className={styles.footer}>
        <p>
          Built with{' '}
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
            Next.js 14
          </a>
          {' · '}
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            React 18
          </a>
          {' · '}
          PostgreSQL · Python FastAPI
        </p>
      </footer>
    </main>
  );
}
