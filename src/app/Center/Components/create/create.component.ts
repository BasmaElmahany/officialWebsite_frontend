import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CenterService } from '../../Services/center.service';
import { MatDialogRef } from '@angular/material/dialog';
import { I18nService } from '../../../Shared/Services/i18n.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private centerService: CenterService,
    private dialogRef: MatDialogRef<CreateComponent>,
    public i18n: I18nService
  ) {
    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      aboutAr: [''],
      aboutEn: [''],
      populationNumber: [0, [Validators.required, Validators.min(0)]],
      dirNameAr: [''],
      dirNameEn: [''],
      dirPositionAr: [''],
      dirPositionEn: [''],
      phoneNumber: [''],
      faxNumber: [''],
      mapLink: [''],
      investmentFactors: this.fb.array([]),
      villages: this.fb.array([])
    });
  }

  /* ================= FORM GETTERS ================= */
  get investmentFactors() {
    return this.form.get('investmentFactors') as FormArray;
  }

  get villages() {
    return this.form.get('villages') as FormArray;
  }

  miniVillages(i: number) {
    return this.villages.at(i).get('miniVillages') as FormArray;
  }

  settlements(i: number, j: number) {
    return this.miniVillages(i).at(j).get('settlements') as FormArray;
  }

  /* ================= FACTORS ================= */
  addFactor() {
    this.investmentFactors.push(
      this.fb.group({
        titleAr: ['', Validators.required],
        titleEn: ['', Validators.required],
        articleAr: [''],
        articleEn: ['']
      })
    );
  }

  removeFactor(i: number) {
    this.investmentFactors.removeAt(i);
  }

  /* ================= VILLAGES ================= */
  addVillage() {
    this.villages.push(
      this.fb.group({
        nameAr: ['', Validators.required],
        nameEn: ['', Validators.required],
        miniVillages: this.fb.array([])
      })
    );
  }

  removeVillage(i: number) {
    this.villages.removeAt(i);
  }

  addMiniVillage(i: number) {
    this.miniVillages(i).push(
      this.fb.group({
        nameAr: ['', Validators.required],
        nameEn: ['', Validators.required],
        settlements: this.fb.array([])
      })
    );
  }

  removeMiniVillage(i: number, j: number) {
    this.miniVillages(i).removeAt(j);
  }

  addSettlement(i: number, j: number) {
    this.settlements(i, j).push(
      this.fb.group({
        nameAr: ['', Validators.required],
        nameEn: ['', Validators.required]
      })
    );
  }

  removeSettlement(i: number, j: number, k: number) {
    this.settlements(i, j).removeAt(k);
  }

  /* ================= SUBMIT ================= */
  submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const payload = this.form.value;
    console.log(payload);

    this.centerService.createCenter(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: () => this.loading = false
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
