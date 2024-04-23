import React, { useMemo } from 'react';

interface SvgIconProps {
    size?: string | number; //图标大小
    width?: string | number; //图标宽
    height?: string | number; //图标高
    color?: string; //图标颜色
    prefix?: string; //前缀 默认icon
    name: string; //文件名称
}

const SvgIcon: React.FC<SvgIconProps> = ({ color, name, size = 16, width = 16, height = 16, prefix = 'icon' }) => {
    const symbolId = useMemo(() => `#${prefix}-${name}`, [prefix, name]);
    return (
        <svg aria-hidden="true" width={width ? width : size} height={height ? height : size} fill={color}>
            <use href={symbolId} fill={color} />
        </svg>
    );
};

export default SvgIcon;
