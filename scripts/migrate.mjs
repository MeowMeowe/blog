import { PrismaClient } from '@prisma/client';

// Additive migration for the existing SQL-initialized database; safe to rerun.
const prisma = new PrismaClient();
async function addColumn(table, column, definition) {
    const rows = await prisma.$queryRaw`SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${table} AND COLUMN_NAME = ${column}`;
    if (!rows.length) await prisma.$executeRawUnsafe(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
}

try {
    await addColumn('users', 'session_version', 'INT NOT NULL DEFAULT 0');
    await addColumn('articles', 'deleted_at', 'DATETIME(3) NULL');
    await addColumn('articles', 'version', 'INT NOT NULL DEFAULT 0');
    await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS article_revisions (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL,
        editor_id INT NULL,
        title VARCHAR(255) NOT NULL,
        snapshot JSON NOT NULL,
        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX article_revisions_article_id_created_at_idx (article_id, created_at),
        CONSTRAINT article_revisions_article_id_fkey FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    const indexes =
        await prisma.$queryRaw`SELECT INDEX_NAME FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'articles' AND INDEX_NAME = 'articles_deleted_at_status_published_at_idx'`;
    if (!indexes.length) await prisma.$executeRawUnsafe('CREATE INDEX articles_deleted_at_status_published_at_idx ON articles(deleted_at, status, published_at)');
    console.log('Database migration complete: sessions, recycle bin, edit versions and revisions.');
} finally {
    await prisma.$disconnect();
}
