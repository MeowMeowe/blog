import sanitizeHtml from 'sanitize-html';

const allowedTags = [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'pre', 'code', 'span', 'figure', 'figcaption', 'aside', 'nav', 'section'];

export function sanitizeArticleHtml(content: string) {
    return sanitizeHtml(content, {
        allowedTags,
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            a: ['href', 'name', 'target', 'rel'],
            img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
            code: ['class'],
            span: ['class'],
            p: ['class'],
            blockquote: ['class'],
            figure: ['class'],
            aside: ['class'],
            nav: ['class', 'aria-label'],
            ol: ['class'],
            div: ['class'],
            h2: ['id']
        },
        allowedSchemes: ['http', 'https', 'mailto'],
        allowedSchemesByTag: {
            img: ['http', 'https']
        },
        allowProtocolRelative: false,
        transformTags: {
            a: (_tagName, attribs) => {
                const { target, ...safeAttributes } = attribs;

                return {
                    tagName: 'a',
                    attribs: {
                        ...safeAttributes,
                        rel: 'noopener noreferrer',
                        ...(target === '_blank' ? { target: '_blank' } : {})
                    }
                };
            }
        }
    });
}
