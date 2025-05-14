import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipe-suggestion',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recipe-suggestion.component.html',
  styleUrls: ['./recipe-suggestion.component.scss'],
})
export class RecipeSuggestionComponent {
  @Input() recipes: any[] = [];
  
}
