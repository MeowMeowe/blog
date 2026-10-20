'use client';
import { useEffect } from 'react';
export default function ViewCounter({ id }: { id: number }) {
    useEffect(() => {
        void fetch(`/api/article/view/${id}`, { method: 'POST' }).catch(() => {});
    }, [id]);
    return null;
}
