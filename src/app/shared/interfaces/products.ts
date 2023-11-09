import { ProductCategoryResponse } from "./productCategory";

export interface ProductsRequest {
    productsCategory: ProductCategoryResponse;
    productsName: string;
    productsLink: string;
    productsCalories: number;
    image: string;
}
export interface ProductsResponse extends ProductsRequest {
    id: number | string;
}