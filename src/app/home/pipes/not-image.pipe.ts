import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notImage'
})
export class NotImagePipe implements PipeTransform {

  transform(images: any[]): string {
    console.log('apply transform:');
    console.log(images);
    if (images.length > 0) {
      return images[0].photos.replace('http://201.217.140.35/sisvend/fotos/','https://imgs.dropshipping.bee-seller.com/');
    }
    return 'assets/img/no_image.png';
  }

}
