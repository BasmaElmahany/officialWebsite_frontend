import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit.component';

@NgModule({
  declarations: [EditComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [EditComponent]
})
export class EditModule {}
