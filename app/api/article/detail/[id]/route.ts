import { getPublicArticle } from '@/lib/public-articles';
import { successResponse, notFoundResponse } from '@/lib/api-response';
import { handleApiError, articleIdFrom } from '@/lib/http';
import { resourceImage } from '@/lib/resource-image';
import { articleDate } from '@/lib/article-date';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const article = await getPublicArticle(articleIdFrom((await params).id));
        if (!article) return notFoundResponse('文章不存在');
        return successResponse({
            id: article.id,
            title: article.title,
            desc: article.description,
            content: article.content,
            cover: resourceImage(article.coverImage),
            icon: resourceImage(article.tags[0]?.tag.icon),
            time: articleDate(article.publishedAt || article.createdAt),
            createTime: (article.publishedAt || article.createdAt).toISOString(),
            updateTime: article.updatedAt.toISOString(),
            view: article.viewCount,
            star: article.starCount,
            tags: article.tags.map(({ tag }) => tag.name),
            techStack: article.techStack.map(({ tech }) => ({ name: tech.name, icon: tech.icon, link: tech.link })),
            links: article.links.map(({ title, url, icon, linkType }) => ({ title, url, icon, type: linkType }))
        });
    } catch (error) {
        return handleApiError(error);
    }
}
