import React, { useEffect, useRef, useState, useCallback } from 'react';
import './index.scss';

interface ColumnConfig {
    width: number;
    title: string;
    key: string;
}

interface CanvasTableProps {
    data: any[][];
    columns: ColumnConfig[];
    rowHeight?: number;
    headerHeight?: number;
}

const CanvasTable: React.FC<CanvasTableProps> = ({ data, columns, rowHeight = 30, headerHeight = 40 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
    const [viewport, setViewport] = useState({
        startRow: 0,
        endRow: 0,
        startCol: 0,
        endCol: 0
    });
    const rafId = useRef<number>();
    const canvasSize = useRef({ width: 0, height: 0 });
    const columnsWidth = useRef<number[]>([]);

    // 计算列宽缓存
    useEffect(() => {
        columnsWidth.current = columns.map((col) => col.width);
    }, [columns]);

    // 初始化画布和视口
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const updateCanvasSize = () => {
            const rect = canvas.parentElement!.getBoundingClientRect();
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            canvasSize.current = { width: rect.width, height: rect.height };
            updateViewport();
        };

        updateCanvasSize();
        const resizeObserver = new ResizeObserver(updateCanvasSize);
        resizeObserver.observe(canvas.parentElement!);

        return () => resizeObserver.disconnect();
    }, []);

    // 视口计算
    const updateViewport = useCallback(() => {
        const { width, height } = canvasSize.current;
        const visibleRows = Math.ceil(height / rowHeight);
        const startRow = Math.floor(scrollPos.y / rowHeight);
        const endRow = startRow + visibleRows + 1;

        let startCol = 0;
        let accWidth = 0;
        for (; startCol < columns.length; startCol++) {
            if (accWidth > scrollPos.x) break;
            accWidth += columnsWidth.current[startCol];
        }

        let endCol = columns.length;
        accWidth = 0;
        for (let i = startCol; i < columns.length; i++) {
            accWidth += columnsWidth.current[i];
            if (accWidth > width + scrollPos.x) {
                endCol = i + 1;
                break;
            }
        }

        setViewport({ startRow, endRow, startCol, endCol });
    }, [scrollPos, columns, rowHeight]);

    // 绘制逻辑
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')!;
        ctx.resetTransform();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(devicePixelRatio, devicePixelRatio);
        ctx.translate(-scrollPos.x, -scrollPos.y);

        // 绘制表头
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(
            0,
            0,
            columnsWidth.current.reduce((a, b) => a + b, 0),
            headerHeight
        );

        // 绘制行
        for (let row = viewport.startRow; row <= viewport.endRow; row++) {
            if (row >= data.length) break;
            const y = headerHeight + row * rowHeight;

            // 斑马纹
            if (row % 2 === 0) {
                ctx.fillStyle = '#fafafa';
                ctx.fillRect(0, y, canvasSize.current.width, rowHeight);
            }

            // 绘制单元格
            let x = 0;
            for (let col = viewport.startCol; col < viewport.endCol; col++) {
                const cellWidth = columnsWidth.current[col];
                const text = data[row][columns[col].key];
                console.log('Rendering cell:', {
                    row,
                    col,
                    key: columns[col].key,
                    value: text
                });
                drawText(ctx, text, x + 5, y + 20, cellWidth - 10);
                x += cellWidth;
            }
        }

        // 绘制列标题
        let x = 0;
        columns.forEach((col, idx) => {
            ctx.fillStyle = '#333';
            ctx.fillText(col.title, x + 5, headerHeight - 10);
            x += columnsWidth.current[idx];
        });
    }, [viewport, data, columns, scrollPos, headerHeight, rowHeight]);

    // 滚动处理
    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = e.currentTarget;

            setScrollPos({
                x: Math.max(0, Math.min(scrollLeft, scrollWidth - clientWidth)),
                y: Math.max(0, Math.min(scrollTop, scrollHeight - clientHeight))
            });

            if (rafId.current) cancelAnimationFrame(rafId.current);
            rafId.current = requestAnimationFrame(draw);
        },
        [draw]
    );

    // 容器尺寸计算
    const totalWidth = columnsWidth.current.reduce((a, b) => a + b, 0);
    const totalHeight = headerHeight + data.length * rowHeight;

    return (
        <div className="canvas-table-container" style={{ overflow: 'auto', position: 'relative' }} onScroll={handleScroll}>
            <div
                style={{
                    width: totalWidth,
                    height: totalHeight,
                    position: 'relative'
                }}
            >
                <canvas
                    ref={canvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        pointerEvents: 'none'
                    }}
                />
            </div>
        </div>
    );
};

// 文字绘制工具函数
function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number) {
    ctx.font = '14px Arial';
    const metrics = ctx.measureText(text);

    if (metrics.width > maxWidth) {
        const ellipsis = '...';
        const ellipsisWidth = ctx.measureText(ellipsis).width;
        let truncated = text;

        while (ctx.measureText(truncated).width + ellipsisWidth > maxWidth) {
            truncated = truncated.slice(0, -1);
        }

        text = truncated + ellipsis;
    }

    ctx.fillText(text, x, y);
}

export default CanvasTable;
