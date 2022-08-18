export type valueof<T> = {
    [P in keyof T]: T[P];
}[keyof T];

export type IPageParams = {
    /*
     *  页数
     */
    pageNum: number;
    /*
     *  一页条数
     */
    pageSize: number;
};
export type IResponse<T> = {
    /*
     *  状态码
     */
    status?: number;
    /*
     *  返回信息
     */
    msg?: string;
    /*
     *  返回信息
     */
    info?: string;
    /**登录接口会返回token */
    refreshToken?: string;
    accessToken?: string;
    /*
     *  返回数据
     */
    data?: any;
    /*
     *  当前时间
     */
    Date?: string;
    /*
     *  当前时间
     */
    time?: number;
};
