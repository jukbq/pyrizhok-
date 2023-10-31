export interface ProductsRequest {
    productsCategory: string;
    productsName: string;
    productsLink: string;
    productsCalories: number;
    productsImages: string;
}
export interface ProductsResponse extends ProductsRequest {
    id: number | string;
}