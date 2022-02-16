import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MeliCategory } from 'src/app/models/meli-publication/meli-category.model';
import { MeliME2Category } from 'src/app/models/meli-publication/meli-me2-category';
import { MeliPublicationsService } from '../../../../services/meli-publications.service';
import { MeliCategoryME2 } from '../../meli-configuration/models/meli-category-me2.model';

@Component({
  selector: 'app-meli-category-path',
  templateUrl: './meli-category-path.component.html',
  styleUrls: ['./meli-category-path.component.css']
})
export class MeliCategoryPathComponent implements OnInit {

  @Input() home: boolean;
  @Output() pathOut: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() categorySelected: EventEmitter<MeliME2Category> = new EventEmitter<MeliME2Category>();
  pathList: string[];

  meliCategoryList: MeliCategory[];
  categoriesME2AllowedList: MeliCategoryME2[];
  meliCategory: MeliCategory;
  subcategory: boolean = false;

  constructor(public meliPublicationsService: MeliPublicationsService) {
    this.meliCategory = new MeliCategory();
    this.pathList = [];
    meliPublicationsService.getAllowedListCategoriesME2().subscribe(list => this.categoriesME2AllowedList = list);
    meliPublicationsService.getMeliCategories().subscribe(list => {
      this.meliCategoryList = list;
    });
   }

  ngOnInit(): void {

  }

  ngOnChanges(): void{
    if(this.home === true && this.subcategory === true){
      this.meliPublicationsService.getMeliCategories().subscribe(list => {
        this.meliCategoryList = list;
      });
      this.home = false;
      this.subcategory = false;
      this.pathList = [];
      this.meliCategory = new MeliCategory();
    }
  }

  getSubCategories(idCategory: string) {
    this.pathList = [];
    this.meliPublicationsService.getMeliSubCategories(idCategory).subscribe(async resp => {
      this.subcategory = true;
      this.meliCategory = resp;
      this.meliCategory.path_from_root.forEach(element => {
        this.pathList.push(element.name);
      });

      if(Object.keys(this.meliCategory).length !== 0) {
        let aCategory = new MeliME2Category('-1');

        //Entra al if si la categoria es Hoja
        if(this.meliCategory.children_categories.length === 0) {
            aCategory.idLastCategory = this.meliCategory.id;

            //Validar si categoria es mercado enviable segun me2 .
            this.meliPublicationsService.getShippingMode(this.meliCategory.id).subscribe(modes => {
              if(modes.includes("me2")) {
                aCategory.isME2 = true;
              } else {
                //si la categoria es igual a alguna categoria de la lista permitida como Mercado Enviable
                if(this.categoriesME2AllowedList.some(f => f.id === this.meliCategory.id))
                   aCategory.isME2 = true;
                 else
                   aCategory.isME2 = false;
              }
              this.categorySelected.emit(aCategory);
            }, (error: any) => {
              if(this.categoriesME2AllowedList.some(f => f.id === this.meliCategory.id))
                aCategory.isME2 = true;
              else
                aCategory.isME2 = false;

              this.categorySelected.emit(aCategory);
               }
            );
        }
      }
      this.pathOut.emit(this.pathList);
    });
  }

}
