import IProduct from "./Product/IProduct"

export interface IPage {
    page: number
    products: IProduct[]
    totalCount: number
}