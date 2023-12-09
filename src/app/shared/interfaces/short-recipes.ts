import { CategoriesDishesResponse } from "./categories -dishes";
import { СuisineResponse } from "./cuisine";
import { DishesResponse } from "./dishes";
import { ProductsRequest } from "./products";
import { MethodCooking } from "./recipes";

export interface DifficultyPreparation {
    list: string;
    linamest: string;
}

export interface ShortRecipeRequest {
    dishes: DishesResponse;
    categoriesDishes: CategoriesDishesResponse;
    recipeKeys: CategoriesDishesResponse;
    cuisine: СuisineResponse;
    autor: string;
    methodCooking: MethodCooking[];
    tools: string[];
    difficultyPreparation: DifficultyPreparation;
    bestSeason: string;
    recipeTitle: string;
    descriptionRecipe: string;
    mainImage: string;
    focusKeyword: string;
    keywords: string;
    numberServings: number;
    ingredients: ProductsRequest;
    rating: number
}

export interface ShortRecipesResponse extends ShortRecipeRequest {
    id: number | string;
}