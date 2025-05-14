import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeAPIService {
  private apiUrl = 'https://api.spoonacular.com';

  constructor(private http: HttpClient) {}

  searchByIngredients(ingredients: string) {
    return this.http.get(`${this.apiUrl}/recipes/complexSearch`, {
      params: {
        includeIngredients: ingredients,
        number: 10,
        addRecipeInformation: true,
        apiKey: environment.apiKey,
      },
    });
  }

  getRecipeInformation(id: string) {
    return this.http.get(`${this.apiUrl}/recipes/${id}/information`, {
      params: {
        apiKey: environment.apiKey,
      },
    });
  }

  getFilteredRecipes(filters: any) {
    const params: any = {
      apiKey: environment.apiKey,
      number: 10,
      addRecipeInformation: true,
    };

    if (filters.cuisine) params.cuisine = filters.cuisine;
    if (filters.dishType) params.type = filters.dishType;
    if (filters.vegetarian) params.vegetarian = true;
    if (filters.vegan) params.vegan = true;
    if (filters.glutenFree) params.glutenFree = true;
    if (filters.readyInMinutes)
      params.maxReadyTime = filters.readyInMinutes;
    if (filters.servings) params.maxServings = filters.servings;

    return this.http.get(`${this.apiUrl}/recipes/complexSearch`, { params });
  }
}
