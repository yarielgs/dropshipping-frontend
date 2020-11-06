import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PageProductStorage } from '../../../../../models/page.product.store';
import { ProductsStorageService } from '../../../../services/products-storage.service';
import { ProductStore } from '../../../../../models/product.store';
import { ProductsMeliPublishedService } from '../../../../services/products.meli.published.service';
import { ProductMeliPublished, PageProductMeliPublished } from '../../../../../models/meli-publication/product-meli-published.model';
import { ChangeStatusPublicationType } from '../../../../../enums/change-status-publication-type';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-published-product',
  templateUrl: './published-product.component.html',
  styleUrls: ['./published-product.component.css']
})
export class PublishedProductComponent implements OnInit {
  meliAccountSearchClear = '';
  typeStateSearchClear = '';
  disable = true;

  public loading = true;
  public loadPaginator = false;
  public loadingClear = false;
  public loadingSearch = false;
  public emptySearch = false;


  public idMeliSearch = '';
  public skuSearch = '';
  public meliAccountSearch = '';
  public typeStateSearch = '';
  public errorProducts = false;
  public empySearch = false;

  // Paginator

  page = 1;
  size = 5;
  checkAll = false;
  public changeStatusPublishType: ChangeStatusPublicationType;


  pageProducts = new PageProductStorage();
  productsSelected: ProductStore[];

  //Loading Modal
  loadingModal = false;
  productsMeliPublished: ProductMeliPublished[] = [];
  pagePublised = new PageProductMeliPublished();
  constructor(private router: Router, public productsMeliPublishedService: ProductsMeliPublishedService) {
    this.loadProductsPaginator();
  }

  selectChangeHandler(size): void {
    this.size = +size;
    this.loadProductsPaginator();
  }

  loadProductByPage(page): void {
    this.page = page;
    this.loadProductsPaginator();
  }

  loadProductsPaginator(): void {
    this.loading = true;
    console.log('page', this.page)
    this.productsMeliPublishedService.
      getProductsPublished(this.page - 1, this.size).subscribe((resp: PageProductMeliPublished) => {

        if (this.loadingSearch && resp.numberOfElements === 0) {
          this.emptySearch = true;
        } else { this.emptySearch = false; }

        this.pagePublised = resp;
        this.productsMeliPublished = this.pagePublised.content;
        console.log(this.productsMeliPublished)
        this.loading = false;
      }, error => {
        this.errorProducts = true;
        this.loadingClear = false;
        this.loadingSearch = false;
        this.emptySearch = false;
        this.loading = false;
      });

  }

  ngOnInit(): void {

  }

  searchProductsPublished() { }

  // Clear search form
  clearSearch(f: NgForm): void {

    this.loadingClear = true;
    this.idMeliSearch = '';
    this.skuSearch = '';
    this.meliAccountSearch = '';
    this.typeStateSearch = '';
  }

  selectAllProducts(): void {
    this.checkAll = !this.checkAll;

    this.pageProducts.itemsGrid.forEach(element => {
      element.selected = this.checkAll;
      if (element.selected === true) {
        let position1 = this.productsSelected.indexOf(element);
        if (position1 === -1) {
          this.productsSelected.push(element);
        }
      }
      else {
        let position = this.productsSelected.indexOf(element);
        if (position !== -1) {
          this.productsSelected.splice(position, 1);
        }

      }
    });
    if (this.checkAll === false) {
      this.disable = true;
    } else {
      this.disable = false;
    }
  }

  selectProduct(product: ProductStore): void {
    let position = this.productsSelected.indexOf(product);
    if (position === -1) {
      product.selected = !product.selected;
      if (product.selected === true) {
        this.productsSelected.push(product);
      }
    }
    else {
      product.selected = !product.selected;
      if (product.selected === false) {
        this.productsSelected.splice(position, 1);
      }
    }
    if (product.selected === false) {
      this.disable = true;
    } else {
      this.disable = false;
    }
  }

  navegateToEdit(product: ProductMeliPublished) {
    let prod = JSON.stringify(product);
    this.router.navigate(['edit-products-published', prod]);
  }

  cipherContent(content: string) {
    let encodeContent = btoa(content);
    let piece = Math.trunc(encodeContent.length / 3);
    let truck = content.substring(piece, piece * 2) + content.substring(0, piece) + content.substring(piece * 2);
    return truck;
  }


  // Change status publications

  changeStatusPublication(product: ProductMeliPublished, status: number): void {
    console.log('product', product);
    console.log('status', status);
    this.loading = true;
    this.productsMeliPublishedService.changeStatusPublication(product.accountMeli, status, product.idPublicationMeli)
      .subscribe((resp: any) => {

        this.loadProductsPaginator();
        if(resp.response){
          this.notificationSuccessChangeStatus(resp.response);
        } else {
          this.notificationErrorChangeStatus(resp);
        }


      }, (error: any) => {
        console.log(error);
        this.notificationErrorChangeStatus(error);
      })

  }


  notificationSuccessChangeStatus(result: string): void {
    let title = '';
    switch (result) {
      case 'active':
        title = `activada`;
        break;

      case 'paused':
        title = `pausada`;
        break;

      default:
        title = 'no cambiada';
        break;
    }
    Swal.fire({
      position: 'top-end',
      icon: result !== 'error' ? 'success' : 'error',
      title: `Publicación ${title} satisfactoriamente`,
      showConfirmButton: true,
      timer: 2000
    }).finally(() => this.loading = false);
  }

  notificationErrorChangeStatus(error?: any): void {

    console.log('Error: ', error);
    let title = 'No se pudo realizar la operación, intente sincronizar su cuenta o consulte al administrador';
    if(error.error_meli !== undefined){
      title = `${title}, mercadolibre no procesó el cambio`;
    }
    this.loading = false
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: `${title}`,
      showConfirmButton: true
    });
  }
}
