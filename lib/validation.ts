import { z } from 'zod';

function isSafeResourceUrl(value: string) {
    if (value.startsWith('/')) {
        return !value.startsWith('//') && !value.includes('\\');
    }

    try {
        const url = new URL(value);
        return (url.protocol === 'http:' || url.protocol === 'https:') && !url.username && !url.password;
    } catch {
        return false;
    }
}

const safeResourceUrl = z.string().trim().max(500).refine(isSafeResourceUrl, 'Only safe relative, HTTP, or HTTPS URLs are allowed');

const optionalText = (max: number) => z.string().trim().max(max).nullable().optional();
const idList = z
    .array(z.number().int().positive())
    .max(50)
    .transform((values) => Array.from(new Set(values)));

export const articleQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(10),
    tag: z.string().trim().max(50).optional(),
    search: z.string().trim().max(100).optional()
});

const articleFields = {
    title: z.string().trim().min(1).max(255),
    description: optionalText(2000),
    content: z.string().trim().min(1).max(1_000_000),
    coverImage: safeResourceUrl.nullable().optional(),
    tagIds: idList.optional(),
    techStackIds: idList.optional(),
    links: z
        .array(
            z.object({
                title: optionalText(100),
                url: safeResourceUrl,
                icon: optionalText(50),
                type: z.enum(['GITHUB', 'DEMO', 'DOCS', 'OTHER']).default('OTHER')
            })
        )
        .max(20)
        .optional(),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    publishedAt: z.iso.datetime().nullable().optional()
};

export const createArticleSchema = z.object(articleFields).strict();

export const updateArticleSchema = z
    .object({
        ...articleFields,
        title: articleFields.title.optional(),
        content: articleFields.content.optional(),
        status: articleFields.status.optional(),
        expectedVersion: z.number().int().nonnegative().optional()
    })
    .strict()
    .refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const createTagSchema = z
    .object({
        name: z.string().trim().min(1).max(50),
        slug: z
            .string()
            .trim()
            .min(1)
            .max(50)
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase letters, numbers, and hyphens only'),
        color: z
            .string()
            .trim()
            .regex(/^#[0-9a-f]{3,8}$/i, 'Color must be a hexadecimal value')
            .nullable()
            .optional(),
        icon: optionalText(50),
        description: optionalText(1000)
    })
    .strict();

export const updateTagSchema = createTagSchema.partial().refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const techStackSchema = z
    .object({
        name: z.string().trim().min(1).max(50),
        icon: optionalText(50),
        link: safeResourceUrl.nullable().optional(),
        description: optionalText(1000)
    })
    .strict();

export const updateTechStackSchema = techStackSchema.partial().refine((value) => Object.keys(value).length > 0, 'At least one field is required');

export const profileSchema = z
    .object({
        displayName: z.string().trim().min(1).max(100),
        avatarUrl: safeResourceUrl.nullable().optional()
    })
    .strict();

export const passwordSchema = z
    .object({
        currentPassword: z.string().min(1).max(200),
        newPassword: z
            .string()
            .min(12)
            .refine((value) => Buffer.byteLength(value, 'utf8') <= 72, '密码最多为 72 个 UTF-8 字节')
    })
    .strict()
    .refine((value) => value.currentPassword !== value.newPassword, {
        message: 'New password must be different from the current password',
        path: ['newPassword']
    });

export function validationMessage(error: z.ZodError) {
    return error.issues[0]?.message || 'Invalid request data';
}
