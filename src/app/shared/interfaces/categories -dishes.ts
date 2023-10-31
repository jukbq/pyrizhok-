import { DishesResponse } from "./dishes";

export interface CategoriesDishesRequest {
    dishes: DishesResponse,
    dishesName: DishesResponse,
    dishesLink: DishesResponse,
    categoryIndex: number,
    categoryName: string,
    categoryLink: string,
    categoryImage: string,
}

export interface CategoriesDishesResponse extends CategoriesDishesRequest {
    id: number | string;
}