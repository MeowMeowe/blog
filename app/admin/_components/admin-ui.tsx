export function PageHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
    return (
        <header className="admin-page-heading">
            <div>
                <span>{eyebrow}</span>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            {actions && <div className="admin-page-actions">{actions}</div>}
        </header>
    );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
    return (
        <div className="admin-empty">
            <span aria-hidden="true">◇</span>
            <strong>{title}</strong>
            <p>{description}</p>
        </div>
    );
}

export function StatusBadge({ status }: { status: string }) {
    const labels: Record<string, string> = {
        PUBLISHED: '已发布',
        DRAFT: '草稿',
        ARCHIVED: '已归档'
    };
    return <span className={`admin-status admin-status--${status.toLowerCase()}`}>{labels[status] || status}</span>;
}
