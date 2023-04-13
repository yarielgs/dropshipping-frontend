import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'uploadImage'
})
export class UploadImagePipe implements PipeTransform {

  transform(images: any[]): string {
    if (images.length > 0) {
      let value = images[0].photos;
      console.log('value: ', value);
      console.log('pedro', value);
      console.log('pedro', value.replace('http://201.217.140.35/sisvend/fotos/','https://imgs.dropshipping.bee-seller.com/'));

      if(value) {
        if(value.trim().startsWith('http://') || value.trim().startsWith('https://')){
          return value.replace('http://201.217.140.35/sisvend/fotos/','https://imgs.dropshipping.bee-seller.com/');
        } else {
          return environment.URI_UPLOAD_BUCKET + value.trim();
        }
      }
    }

    return 'assets/img/no_image.png';
  }

}
