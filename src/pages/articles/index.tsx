import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as marked from 'marked';
import { getArticleById } from '@/api/articles';
import './index.scss';

interface Article {
    id: number;
    title: string;
    content: string;
    createTime: string;
    updateTime: string;
    author: string;
    tags: string[];
}

const Articles: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const id = searchParams.get('id');
                if (!id) {
                    setError('Article ID not found');
                    setLoading(false);
                    return;
                }

                const data = await getArticleById(parseInt(id));
                setArticle(data);
            } catch (err) {
                setError('Failed to load article');
                console.error('Error fetching article:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [searchParams]);

    if (loading) {
        return <div className="articles-loading">Loading...</div>;
    }

    if (error) {
        return <div className="articles-error">{error}</div>;
    }

    if (!article) {
        return <div className="articles-not-found">Article not found</div>;
    }

    return (
        <div className="articles">
            <article className="article-content">
                <header className="article-header">
                    <h1>{article.title}</h1>
                    <div className="article-meta">
                        <span>By {article.author}</span>
                        <span>Created: {new Date(article.createTime).toLocaleDateString()}</span>
                        <span>Updated: {new Date(article.updateTime).toLocaleDateString()}</span>
                    </div>
                    <div className="article-tags">
                        {article.tags.map((tag, index) => (
                            <span key={index} className="tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>
                <div className="article-body" dangerouslySetInnerHTML={{ __html: marked(article.content) }} />
            </article>
        </div>
    );
};

export default Articles;
