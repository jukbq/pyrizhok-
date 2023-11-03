export interface DishesRequest {
    dishesindex: number;
    dishesName: string;
    dishesLink: string;
    image: string;
}
export interface DishesResponse extends DishesRequest {
    id: number | string;
}