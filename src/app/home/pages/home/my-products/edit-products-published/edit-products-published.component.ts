import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsStorageUserService } from '../../../../services/products-storage-user.service';
import { MeliAccountService } from '../../../../services/meli-account.service';
import { MarginService } from '../../../../services/margin.service';
import { MeliPublicationsService } from '../../../../services/meli-publications.service';
import Swal from 'sweetalert2';
import { ProductMeliPublished } from '../../../../../models/meli-publication/product-meli-published.model';
import { Image } from '../../../../../models/image.model';
import { AccountMarginModel } from 'src/app/models/relatioship-account-margin.model';
import { ResponseCategoryPredictor } from 'src/app/models/meli-publication/response-category-predictor.model';
import { MeliCategory } from 'src/app/models/meli-publication/meli-category.model';
import { MeliPathRoot } from 'src/app/models/meli-publication/meli-path-from-root.model';
import { Margin } from 'src/app/models/margin';
import { MeliAccount } from 'src/app/models/meli.account';
import { AccountMeliStates } from 'src/app/enums/account-meli-states.enum';
import { MarketplaceType } from 'src/app/enums/marketplacetype.enum';
import { StatesOfMeli } from 'src/app/enums/states-of-meli.enum';


@Component({
  selector: 'app-edit-products-published',
  templateUrl: './edit-products-published.component.html',
  styleUrls: ['./edit-products-published.component.css']
})

export class EditProductsPublishedComponent implements OnInit {

  @ViewChild('closeModal') closeModal;
  @ViewChild('closeModalLoading') closeModalLoading;
  @ViewChild('closeMargin') closeMargin;
  @ViewChild('checkConfig') checkConfig;
 //Loading Modal
 loadingModal = false; 

  productsDeletedList: number[];
  imagesDeletedList: string[];
  productMeliPublished: ProductMeliPublished; 
  imageToDelete: Image;  
  meliCategoryActive: MeliCategory;
  subCategoriesActiveList: MeliPathRoot[];
  pathActive: string = "";   

  loadedAccountMeli: boolean = false;
  loadedMarginMeli: boolean = false;
  reloadConfig: boolean = false; // si e habilitó la reconfiguracion
  activeConfig: boolean = false; 
  init: boolean = true;

  edit = false;  
  message: string;
  imagePath: string;
  imgURL: any;
  file: any;
  titleImage:string;
  orderImage: number;
  
  id: number = -1;
  public urlP = "";
  public titleP: string;
  public orderP: number = -1;

  /**Seccion para la vista Publicar */
  meliAccountsList: MeliAccount[]; 
  accountMarginsList: AccountMarginModel[];
  initialMeliAccounts: MeliAccount[];
  account_margin: AccountMarginModel; 
  marginsList: Margin[];     
  margin: number = -1;  
  meliAccount: number = -1;
  warrantyType: number = -1;
  warrantyTime: number = 0;
  warranty: boolean = false; 
  responsePredictor: ResponseCategoryPredictor;
  withoutPredictor: boolean = false;

  lastCategorySelected: string = '-1';
  home: boolean = false;
  pathList: string[];


  constructor(private _router: ActivatedRoute, private router: Router, public productsStorageUserService: ProductsStorageUserService, public meliAccountService: MeliAccountService,
    public marginService: MarginService,public meliPublicationsService: MeliPublicationsService ) { }

  ngOnInit(): void {
    this.loadingModal = false;
    this.account_margin = new AccountMarginModel();
    this.responsePredictor = new ResponseCategoryPredictor();
    this.responsePredictor.predictor = false;

    this.getProduct();
    this.getAccountMeli();  
    this.getMargins();
    //this.loadRelationAccountMargin();
    //this.getPredictorCategories();
    this.productsDeletedList = [];    
    this.imagesDeletedList = [];
    this.accountMarginsList = [];
    
  }

  checkInitial(): void{    
    if(this.loadedAccountMeli && this.loadedMarginMeli && this.init){
        this.loadRelationAccountMargin();
    }
  }

  public get statesOfMeli(): typeof StatesOfMeli {
    return StatesOfMeli; 
  }

  decipherContent(encodeContent: string){    
    let piece = Math.trunc(encodeContent.length / 3);
    let truck = encodeContent.substring(piece, piece*2) + encodeContent.substring(0, piece) + encodeContent.substring(piece*2);
    let content = atob(truck);
    return content;
  }

  getProduct(){
    let encode = this._router.snapshot.paramMap.get('product');
   // let product = this.decipherContent(encode);
    this.productMeliPublished = JSON.parse(encode);
    this.getCategoryOfActiveProduct(this.productMeliPublished.categoryMeli);
  }

  getPredictorCategories(){
    /*
     this.meliPublicationsService.getCategoryByPredictor(this.editableProduct.productName).subscribe(predictorList => {
      let p = predictorList;
      if(predictorList.length !== 0){
        this.responsePredictor.predictor = true; 
         this.responsePredictor.meliPredictorCategory = predictorList;
      }  
      else{
         this.responsePredictor.predictor = false; 
         this.responsePredictor.meliPredictorCategory = [];
      }      
     },(error: any) => {
         this.responsePredictor.predictor = false; 
         this.responsePredictor.meliPredictorCategory = [];
    });*/
  }

  getCategoryOfActiveProduct(idCategory: string){
    this.subCategoriesActiveList = [];
      this.meliPublicationsService.getMeliSubCategories(idCategory).subscribe(category => {
          this.meliCategoryActive = category;
          this.subCategoriesActiveList = this.meliCategoryActive.path_from_root;
          for (let index = 0; index < this.subCategoriesActiveList.length; index++) {
            if(index + 1 === this.subCategoriesActiveList.length){
              this.pathActive = this.pathActive + this.subCategoriesActiveList[index].name;
            }
            else{
              this.pathActive = this.pathActive + this.subCategoriesActiveList[index].name + " > ";
            }           
          }
          return this.meliCategoryActive;
      })
  }

  saveForm(){
    /*
    this.loadingModal = true; 
    this.productsStorageUserService.updateCustomProduct(this.editableProduct, this.productsDeletedList).subscribe(item => {      
      this.editableProduct = item;
      this.productsDeletedList = [];
      this.loadingModal = false;       
      this.close();
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Actualizado`,
        text: `Sus productos han sido actualizados correctamente.`,
        showConfirmButton: false,
        timer: 5000
      });

      //Elimino las imagenes fisicamente del servidor
      if(this.imagesDeletedList.length !== 0){
      this.productsStorageUserService.deleteImages(this.imagesDeletedList).subscribe();
      this.imagesDeletedList = [];
    }
      
    },(error: any) => {
      this.loadingModal = false;      
      this.close();
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Error`,
        text: `Error al actualizar. Sincronice sus productos.`,
        showConfirmButton: false,
        timer: 5000
      });
      this.imagesDeletedList = [];
      this.productsDeletedList = [];
    });  
   */
  };

  editProduct(image: Image){
    this.id = +image.id;
    this.edit = true;

    this.orderP = image.order;;
    this.titleP = image.title;
    this.urlP = image.photos   
  }

  updateProduct(image: Image){
    if(image.id === this.id){    
      image.order = this.orderP;
      image.title = this.titleP;
      image.photos = this.urlP;
      this.clear();      
    }
    else{
      this.clear();
    }
  }

  cancelProduct(){
    this.clear();
  }

  deleteImage(){
    /*
    this.productsDeletedList.push(this.imageToDelete.id); 
    this.imagesDeletedList.push(this.imageToDelete.photos);
    let position = this.editableProduct.images.indexOf(this.imageToDelete);
    this.editableProduct.images.splice(position, 1);*/
  }

  previousDelete(image: Image){
    this.imageToDelete = image;
  }

  clear(){
    this.orderP = -1;
    this.titleP = "";
    this.urlP = "";
    this.id = -1;
    this.edit = false;
    this.imageToDelete = null;
  }

  /* ************* Subir Imagenes ********** */
  preview(files) {
    if (files.length === 0){
      this.file = null;
      this.message = "Archivo inválido";
      return;
    }  
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.file = null;
      this.message = "El archivo no es una imagen.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
      this.message = "";
      this.file = files[0];
    }
  }

  addedImage() {
    if (!this.file) {  
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Debe seleccionar un archivo`,
        showConfirmButton: false,
        timer: 5000
      });
      return;
    }
    if (this.file.type.match(/image\/*/) == null) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Solo imagenes`,
        text: 'El archivo no es una imagen',
        showConfirmButton: false,
        timer: 5000
      });     
      return;
    }
    const formData: FormData = new FormData();
    formData.append('image', this.file, this.file.name);

    this.productsStorageUserService.uploadImage(formData)
      .subscribe(resp => {  
        if(resp.success === true) {   
        let image_added = new Image();
        image_added.order = this.orderImage;
        image_added.title = this.titleImage;
        image_added.photos = resp.reason;
       // this.editableProduct.images.push(image_added);
      
        this.clearImage();
        this.close();   
      }
      },(error: any) => {
        if(error.status >= 200 && error.status <= 299)
        {
          let image_added = new Image();
          image_added.order = this.orderImage;
          image_added.title = this.titleImage;
          image_added.photos = error.error.text;
          //this.editableProduct.images.push(image_added);
        }
        else if(error.error.message.includes('Maximum upload size exceeded')){        
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Error`,
          text: 'Su imagen excede el tamaño máximo de 2MB (Mega Byte), lea la ayuda para mas información',
          showConfirmButton: false,
          timer: 5000
        });
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: `Error`,
            text: 'Error almacenando la imagen. Contacte con el administrador',
            showConfirmButton: false,
            timer: 5000
          });
        }
        this.clearImage();
        this.close();
        
      });
  }
  clearImage(){
    this.orderImage = null;
    this.titleImage = "";
    this.message = "";
    this.imagePath = "";
    this.imgURL = null;
    this.file = null;    
  }

  close(){
    this.closeModal.nativeElement.click();
    this.closeModalLoading.nativeElement.click();
  }

  /** Seccion para la vista Publicar */

  loadRelationAccountMargin(){
    if(this.productMeliPublished.margin !== -1){
      this.margin = this.productMeliPublished.margin;
    }
    this.meliAccount = this.productMeliPublished.accountMeli;
    this.addRelationAccountMargin();
    this.init = false; //ya inicializó (init = false)
  }

  addRelationAccountMargin(){   
    if(this.meliAccount !== -1){      
      let accountMargin = new AccountMarginModel();

      var account = this.meliAccountsList.find(element => element.id == this.meliAccount);
      accountMargin.accountName = account.businessName;
      accountMargin.idAccount = account.id;

      if(this.margin !== -1){
        var margin = this.marginsList.find(element => element.id == this.margin);
        accountMargin.idMargin =  margin.id;
        accountMargin.nameMargin = margin.name;
        accountMargin.typeMargin = margin.type;
        accountMargin.valueMargin = margin.value; 
      }else{
        accountMargin.idMargin = -1;
        accountMargin.nameMargin = "";
      }
      this.accountMarginsList.push(accountMargin);
      let index = this.meliAccountsList.indexOf(account);
      this.meliAccountsList.splice(index, 1);
      this.closeModalMargin();      
    }
  } 

  changeConfig(check: boolean){
    this.checkConfig.nativeElement.checked = 0;
    if(!this.reloadConfig){ // no ha sido reconfigurado
      if(check === true){      
        Swal.fire({
          title: 'Importante',
          icon: 'info',
          text: 'La configuración actual se perderá al habilitar esta opción. ¿Deseas continuar?',
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          confirmButtonText: 'Aceptar',        
          cancelButtonText: 'Cancelar',        
        }).then((result) => {        
            if (result.isConfirmed) {
              this.activeConfig = true;
              this.reloadConfig = true; // avtivo reconfiguración
              this.accountMarginsList.forEach(result => {
                this.account_margin = result;
                this.deleteRelationAccountMargin();
              });
              this.checkConfig.nativeElement.checked = 1;
            } else {
              this.activeConfig = false;
            }
        })
      }
      else{
        this.activeConfig = false;
      } 
    }   

  }

  getAccountMeli(){
    this.meliAccountsList = [];
    this.initialMeliAccounts = [];
    this.meliAccountService.getAccounts().subscribe(resp => {
      resp.forEach(element => {
        if(element.status === AccountMeliStates.SYNCHRONIZED && element.marketplaceId === MarketplaceType.MERCADOLIBRE){          
          this.meliAccountsList.push(element);
        }
      });
      this.meliAccountsList.forEach(element => { this.initialMeliAccounts.push(element);});
      
      //Para disparar el metodo loadRelationAccountMargin()
      this.loadedAccountMeli = true;
      if(this.init){
        this.checkInitial();
      }
    })    
  }

  deleteRelationAccountMargin(){
    if(this.account_margin != null){
      let account = this.initialMeliAccounts.find(element => element.id == this.account_margin.idAccount);
      let position = this.initialMeliAccounts.indexOf(account);
      this.meliAccountsList.splice(position, 0, account);
      let position2 = this.accountMarginsList.indexOf(this.account_margin);
      this.accountMarginsList.splice(position2, 1);      
    }
  }

  getMargins(){
    this.marginsList = [];
    this.marginService.getMargins().subscribe(resp => {
      resp.forEach(element => {
        if(element.marketplaceId === MarketplaceType.MERCADOLIBRE){
          this.marginsList.push(element);
        }
      });

      //Para disparar el metodo loadRelationAccountMargin()
      this.loadedMarginMeli = true;
      if(this.init){
        this.checkInitial();
      }
    })
  }  

  previewDelete(relationship: AccountMarginModel){
    this.account_margin = relationship;
  }

  closeModalMargin(){     
    this.clearSome();  
    this.closeMargin.nativeElement.click();         
  }

  clearSome(){
    this.account_margin = null; 
    this.margin = -1; 
    this.meliAccount = -1;  
  }

  clearAll(){
     this.account_margin = null;
    this.accountMarginsList = [];
    this.meliAccountsList = [];
    this.pathList = [];
    this.home = true;
    this.warrantyType = -1;
    this.warrantyTime = -1;
    this.warranty = false;
  }

  closeEditPublished(){
    this.clearAll();
    //this.initialMeliAccounts.forEach(element => { this.meliAccountsList.push(element);}); 
    this.router.navigate(['/published-products']);
  }

  publishProducts(){  
    Swal.fire({
      position: 'top-end',
      icon: 'info',
      title: `Producto en publicación`,
      text: `El producto está siendo publicado`,
      showConfirmButton: false,
      timer: 5000
    })
    .then((result) => {
      this.router.navigate(['/publish-myproducts']);
    });  
   

   // llamada al servicio Publicar
   // this.meliPublicationsService.createPublicationByEditableProduct(this.accountMarginsList, this.lastCategorySelected, this.warrantyType, this.warrantyTime, this.warranty, this.editableProduct);
    this.clearAll();
  }

  getPath(pathList: string[]){
    this.pathList = [];
    this.pathList = pathList;
    this.home = false;
  }

  getCategorySelected(idCategory: string){
    this.lastCategorySelected = idCategory;   
  }

  setHome(){
    this.home = true;
    this.pathList = [];
  }

  activeAllCategory(){
    this.withoutPredictor = true;
    this.setHome();
  }

}