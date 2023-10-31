export interface СuisineRequest {
    cuisineName: string;
    cuisineLink: string;
    cuisineImages: string;
}
export interface СuisineResponse extends СuisineRequest {
    id: number | string;
}