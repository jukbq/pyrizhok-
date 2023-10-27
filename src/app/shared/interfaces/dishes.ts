export interface DishesRequest {
    dishesindex: number;
    dishesName: string;
    dishesLink: string;
    dishesImages: string;
}
export interface DishesResponse extends DishesRequest {
    id: number | string;
}