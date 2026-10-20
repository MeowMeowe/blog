'use client';
import { useState } from 'react';
import { FALLBACK_IMAGE } from '@/lib/resource-image';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    noLoading?: boolean;
}
export default function LazyImage({ src, alt, noLoading = false, onError, ...rest }: LazyImageProps) {
    const [failed, setFailed] = useState<string | null>(null);
    return (
        <img
            {...rest}
            src={failed === src ? FALLBACK_IMAGE : src}
            alt={alt}
            loading={noLoading ? 'eager' : 'lazy'}
            decoding="async"
            onError={(event) => {
                setFailed(src);
                onError?.(event);
            }}
        />
    );
}
