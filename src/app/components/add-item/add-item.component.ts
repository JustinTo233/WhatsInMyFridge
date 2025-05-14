import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent {
  item = '';
  @Output() itemAdded = new EventEmitter<string>();
  @Output() clearedWarning = new EventEmitter<void>();

  addItem() {
    if (this.item.trim()) {
      this.itemAdded.emit(this.item);
      this.item = '';
      this.clearedWarning.emit();
    }
  }
}
