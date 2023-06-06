// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  URI_ROOT: 'https://dev-api.dropshipping.bee-seller.com/pepeganga',
  URI_MELI: `http://auth.mercadolibre.com.uy/authorization?response_type=code&client_id=308575204088057&state=${Math.floor(Math.random() * 100)}&redirect_uri=https://dev.dropshipping.bee-seller.com/home/meli-accounts`,
  URI_MELI_PUBLIC: 'https://api.mercadolibre.com',
  URI_RESET_PASS: 'https://dev.dropshipping.bee-seller.com/auth/reset',
  URI_UPLOAD_BUCKET: 'https://api.dropshipping.bee-seller.com/pepeganga/upload/api/bucket/download-file-from-upload-bucket?pathFile='
};

/*
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
