import React, { useState, useEffect, useRef } from 'react';
import Loading from '../loading';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    noLoading?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, noLoading = false, ...rest }) => {
    return (
        <React.Suspense fallback={noLoading ? <div /> : <Loading />}>
            <LazyImageComponent src={src} alt={alt} {...rest} />
        </React.Suspense>
    );
};

const LazyImageComponent: React.FC<LazyImageProps> = ({ src, alt, ...rest }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (imgRef.current) {
            const img = imgRef.current;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        const image = new Image();
                        image.src = src;
                        image.onload = () => {
                            setIsLoading(false);
                            img.src = src;
                        };
                        observer.unobserve(img);
                    }
                },
                { rootMargin: '100px 0px' }
            );
            observer.observe(img);
            return () => observer.unobserve(img);
        }
    }, [src]);

    return <img ref={imgRef} src={isLoading ? '/img/control.png' : src} alt={alt} {...rest} />;
};

export default LazyImage;
