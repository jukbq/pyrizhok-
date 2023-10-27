import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { MatSliderModule } from "@angular/material/slider";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

const MATERIAL = [
  MatSliderModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatButtonModule,
  MatExpansionModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...MATERIAL,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    ...MATERIAL,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: MatDialogRef, useValue: {} }],
})
export class SharedModule { }
