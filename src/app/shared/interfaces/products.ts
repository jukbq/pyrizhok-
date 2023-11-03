export interface ProductsRequest {
    productsCategory: string;
    productsName: string;
    productsLink: string;
    productsCalories: number;
    image: string;
}
export interface ProductsResponse extends ProductsRequest {
    id: number | string;
}