import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CenterService } from '../../Services/center.service';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { Center, UpdateCenter } from '../../Models/center';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {

  loading = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private centerService: CenterService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) public center: Center,
    public i18n: I18nService
  ) {
    this.buildForm();
    this.patchData();
  }

  /* ================= FORM ================= */
  private buildForm(): void {
    this.form = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      aboutAr: [''],
      aboutEn: [''],
      populationNumber: [null],

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

  /* ================= GETTERS ================= */
  get investmentFactors(): FormArray {
    return this.form.get('investmentFactors') as FormArray;
  }

  get villages(): FormArray {
    return this.form.get('villages') as FormArray;
  }

  miniVillages(i: number): FormArray {
    return this.villages.at(i).get('miniVillages') as FormArray;
  }

  settlements(i: number, j: number): FormArray {
    return this.miniVillages(i).at(j).get('settlements') as FormArray;
  }

  /* ================= PATCH ================= */
  private patchData(): void {
    if (!this.center) return;

    this.form.patchValue({
      nameAr: this.center.nameAr,
      nameEn: this.center.nameEn,
      aboutAr: this.center.aboutAr,
      aboutEn: this.center.aboutEn,
      populationNumber: this.center.populationNumber,

      dirNameAr: this.center.dirNameAr,
      dirNameEn: this.center.dirNameEn,
      dirPositionAr: this.center.dirPositionAr,
      dirPositionEn: this.center.dirPositionEn,
      phoneNumber: this.center.phoneNumber,
      faxNumber: this.center.faxNumber,
      mapLink: this.center.mapLink
    });

    /* ===== Investment Factors ===== */
    this.center.investmentFactors?.forEach(f => {
      this.investmentFactors.push(
        this.fb.group({
          id: [f.id], // ⭐ مهم
          titleAr: [f.titleAr, Validators.required],
          titleEn: [f.titleEn, Validators.required],
          articleAr: [f.articleAr],
          articleEn: [f.articleEn]
        })
      );
    });

    /* ===== Villages ===== */
    this.center.villages?.forEach(v => {
      const villageGroup = this.fb.group({
        id: [v.id], // ⭐
        nameAr: [v.nameAr, Validators.required],
        nameEn: [v.nameEn, Validators.required],
        miniVillages: this.fb.array([])
      });

      this.villages.push(villageGroup);

      v.miniVillages?.forEach(m => {
        const miniGroup = this.fb.group({
          id: [m.id], // ⭐
          nameAr: [m.nameAr, Validators.required],
          nameEn: [m.nameEn, Validators.required],
          settlements: this.fb.array([])
        });

        (villageGroup.get('miniVillages') as FormArray).push(miniGroup);

        m.settlements?.forEach(s => {
          (miniGroup.get('settlements') as FormArray).push(
            this.fb.group({
              id: [s.id], // ⭐
              nameAr: [s.nameAr, Validators.required],
              nameEn: [s.nameEn, Validators.required]
            })
          );
        });
      });
    });
  }

  /* ================= ADD / REMOVE ================= */

  addFactor(): void {
    this.investmentFactors.push(
      this.fb.group({
        id: [null],
        titleAr: ['', Validators.required],
        titleEn: ['', Validators.required],
        articleAr: [''],
        articleEn: ['']
      })
    );
  }

  removeFactor(i: number): void {
    this.investmentFactors.removeAt(i);
  }

  addVillage(): void {
    this.villages.push(
      this.fb.group({
        id: [null],
        nameAr: ['', Validators.required],
        nameEn: ['', Validators.required],
        miniVillages: this.fb.array([])
      })
    );
  }

  removeVillage(i: number): void {
    this.villages.removeAt(i);
  }

  addMiniVillage(i: number): void {
    this.miniVillages(i).push(
      this.fb.group({
        id: [null],
        nameAr: ['', Validators.required],
        nameEn: ['', Validators.required],
        settlements: this.fb.array([])
      })
    );
  }

  removeMiniVillage(i: number, j: number): void {
    this.miniVillages(i).removeAt(j);
  }

  addSettlement(i: number, j: number): void {
    this.settlements(i, j).push(
      this.fb.group({
        id: [null],
        nameAr: ['', Validators.required],
        nameEn: ['', Validators.required]
      })
    );
  }

  removeSettlement(i: number, j: number, k: number): void {
    this.settlements(i, j).removeAt(k);
  }

  /* ================= SUBMIT ================= */
  submit(): void {
    if (this.form.invalid || this.loading) return;

    this.loading = true;

    console.log(this.form)
    const payload = {
      ...this.form.value,
      phoneNumber: String(this.form.value.phoneNumber),
      faxNumber: String(this.form.value.faxNumber)
    };
    console.log(payload)
    this.centerService.updateCenter(this.center.id, payload).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: () => (this.loading = false)
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
