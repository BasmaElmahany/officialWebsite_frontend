import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpperDevService } from '../../Services/upper-dev.service';
import { CenterService } from '../../../Center/Services/center.service';
import { I18nService } from '../../../Shared/Services/i18n.service';
import { CenterList } from '../../../Center/Models/center';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  loading = true;

  centersList: CenterList[] = [];

  dataObj: any;

  pdfPreview?: SafeResourceUrl;
  fileName ?= '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,   // id
    private dialogRef: MatDialogRef<DetailsComponent>,
    private service: UpperDevService,
    private centerService: CenterService,
    public i18n: I18nService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    this.loadCenters();
    this.loadDetails();
  }

  loadDetails(){

    this.service.getbyId(this.data.id).subscribe(res=>{

      this.dataObj = res;

        // Existing file
      if (res.fileUrl) {
        this.fileName = res.fileUrl.split('/').pop();

        this.pdfPreview =
          this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://shusha.minya.gov.eg:93' + res.fileUrl
          );
      }

      this.loading = false;
    });
  }

  loadCenters(){
    this.centerService.getListCenters().subscribe(res=>{
      this.centersList = res;
    });
  }

  getCenterName(id:string):string{

    const c = this.centersList.find(x=>x.id===id);

    return c
      ? (this.i18n.currentLang==='ar'?c.nameAr:c.nameEn)
      : '';
  }

  close(){
    this.dialogRef.close();
  }
}
