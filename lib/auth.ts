import bcrypt from 'bcryptjs';

/**
 * 生成密码哈希
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

/**
 * 验证密码
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * 用户角色枚举
 */
export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    VIEWER = 'viewer'
}

/**
 * 检查用户是否有权限
 */
export function hasPermission(userRole: string, requiredRole: UserRole): boolean {
    const roleHierarchy = {
        [UserRole.ADMIN]: 3,
        [UserRole.EDITOR]: 2,
        [UserRole.VIEWER]: 1
    };

    const userLevel = roleHierarchy[userRole as UserRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
}

/**
 * 检查是否为管理员
 */
export function isAdmin(userRole: string): boolean {
    return userRole === UserRole.ADMIN;
}
