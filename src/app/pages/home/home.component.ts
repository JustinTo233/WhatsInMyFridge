import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddItemComponent } from '../../components/add-item/add-item.component';
import { IngredientListComponent } from '../../components/ingredient-list/ingredient-list.component';
import { RecipeSuggestionComponent } from '../../components/recipe-suggestion/recipe-suggestion.component';
import { RecipeAPIService } from '../../services/recipe-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddItemComponent,
    IngredientListComponent,
    RecipeSuggestionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          height: '*',
          opacity: 1,
          padding: '1rem 2rem',
          marginBottom: '2rem',
        })
      ),
      state(
        'out',
        style({
          height: '0px',
          opacity: 0,
          padding: '0 2rem',
          marginBottom: '0',
          overflow: 'hidden',
        })
      ),
      transition('in <=> out', animate('300ms ease-in-out')),
    ]),
  ],
})
export class HomeComponent {
  ingredients: string[] = [];
  recipes: any[] = [];
  loading = false;
  warningMessage = '';

  showFilters = true;

  filters = {
    cuisine: '',
    dishType: '',
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    servings: null,
    readyInMinutes: null,
  };

  cuisines = ['African', 'Asian', 'American', 'British', 'Cajun'];
  dishTypes = [
    'Main Course',
    'Side Dish',
    'Dessert',
    'Appetizer',
    'Salad',
    'Bread',
    'Breakfast',
    'Soup',
    'Beverage',
    'Sauce',
    'Marinade',
    'Fingerfood',
    'Snack',
    'Drink',
  ];

  sortOption = '';

  constructor(
    private recipeService: RecipeAPIService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadFromStorage();
  }

  clearIngredients() {
    this.ingredients = [];
    localStorage.removeItem('ingredients');
  }

  onItemAdded(item: string) {
    this.ingredients.push(item);
    this.saveToStorage();
  }

  onItemsChange(items: string[]) {
    this.ingredients = items;
    this.saveToStorage();
  }

  generateRecipes() {
    if (this.ingredients.length === 0) {
      this.warningMessage = 'Please add at least one ingredient.';
      return;
    }

    this.warningMessage = '';
    this.loading = true;

    this.recipeService
      .searchByIngredients(this.ingredients.join(','))
      .subscribe(
        (res: any) => {
          this.recipes = res.results;
          this.saveToStorage();
          this.loading = false;
        },
        (error) => {
          console.error(error);
          this.loading = false;
        }
      );
  }

  clearWarningMessage() {
    this.warningMessage = '';
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  applyFilters() {
    console.log('Applying filters:', this.filters);
    this.loading = true;
    this.recipeService.getFilteredRecipes(this.filters).subscribe(
      (results: any) => {
        this.recipes = results.results; // ✅ Access 'results' property
        this.loading = false;
        this.saveToStorage();
      },
      (error) => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  clearFilters() {
    this.filters = {
      cuisine: '',
      dishType: '',
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      servings: null,
      readyInMinutes: null,
    };
    this.applyFilters();
  }

  sortRecipes() {
    if (this.sortOption === 'title') {
      this.recipes.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortOption === 'readyInMinutes') {
      this.recipes.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
    } else if (this.sortOption === 'servings') {
      this.recipes.sort((a, b) => a.servings - b.servings);
    }
  }

  saveToStorage() {
    localStorage.setItem('ingredients', JSON.stringify(this.ingredients));
    localStorage.setItem('recipes', JSON.stringify(this.recipes));
  }

  loadFromStorage() {
    const savedIngredients = localStorage.getItem('ingredients');
    const savedRecipes = localStorage.getItem('recipes');

    if (savedIngredients) {
      this.ingredients = JSON.parse(savedIngredients);
    }

    if (savedRecipes) {
      this.recipes = JSON.parse(savedRecipes);
    }
  }
}
