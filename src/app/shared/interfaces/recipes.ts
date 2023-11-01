import { CategoriesDishesRequest } from "./categories -dishes";
import { СuisineRequest } from "./cuisine";
import { DishesRequest } from "./dishes";
import { ProductsRequest } from "./products";

export interface RecipeStep {
    setepNumber: number;
    stepName: string;
    stepDescription: string;
    stepImage: string;
    stepVideo: string;
    stepNotes: string;
}

export interface MethodCooking {
    methodCookingName: string;
}


export interface RecipesRequest {
    //Сторінка 1
    dishes: DishesRequest;
    categoriesDishes: CategoriesDishesRequest;
    recipeKeys: CategoriesDishesRequest;
    cuisine: СuisineRequest;
    autor: string;
    methodCooking: MethodCooking[];
    tools: string[];
    difficultyPreparation: string;
    bestSeason: string;

    //Сторінка 2
    recipeTitle: string;
    recipeSubtitles: string;
    descriptionRecipe: string;
    focusKeyword: string;
    keywords: string;

    //Сторінка 3
    numberServings: number;
    quantityIngredients: number;
    unitsMeasure: number | string;
    ingredients: ProductsRequest;
    notes: string;

    //Сторінка 4
    steps: RecipeStep[];

}
export interface RecipesResponse extends RecipesRequest {
    id: number | string;
}