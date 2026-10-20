import ArticleEditor from '../../../_components/article-editor';
import { notFound } from 'next/navigation';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const rawId = (await params).id;
    const id = Number(rawId);
    if (!/^[1-9]\d*$/.test(rawId) || !Number.isSafeInteger(id)) notFound();
    return <ArticleEditor articleId={id} />;
}
