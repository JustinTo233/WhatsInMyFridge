import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeAPIService } from '../../services/recipe-api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent {
  recipe: any = null;
  instructionSteps: string[] = [];
  ingredients: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeAPIService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recipeService.getRecipeInformation(id).subscribe((res: any) => {
        console.log('recipe data', res);
        this.recipe = res;
        this.instructionSteps = this.splitInstructions(res.instructions);
      });
    }
  }

  splitInstructions(instructions: string): string[] {
    if (!instructions) return [];

    instructions = instructions.replace(/<\/?p>/gi, '');

    // Check if instructions contain HTML list items
    if (instructions.includes('<li>')) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(instructions, 'text/html');
      return Array.from(doc.querySelectorAll('li'))
        .map((li) => li.textContent?.trim() || '')
        .filter((text) => text.length > 0);
    }

    // Fallback for plain-text instructions
    return instructions
      .split(/(?<=\.)\s+(?=[A-Z])/g) // split at end of sentence
      .map((step) => step.trim())
      .filter((step) => step.length > 0);
  }

  goBack() {
    this.router.navigate(['/']); // navigate back to Home
  }

  convertSpoonacularLinks(summary: string): string {
    return summary.replace(
      /<a[^>]*href="https:\/\/spoonacular\.com\/recipes\/([^"]+)-(\d+)"[^>]*>([^<]+)<\/a>/g,
      (_, title, id, linkText) => {
        const formattedText = linkText
          .split(' ')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return `<a class="similar-recipe-link" href="/recipe/${id}">${formattedText}</a>`;
      }
    );
  }

  getSanitizedSummary(summary: string): SafeHtml {
    const converted = this.convertSpoonacularLinks(summary);
    return this.sanitizer.bypassSecurityTrustHtml(converted);
  }
}
