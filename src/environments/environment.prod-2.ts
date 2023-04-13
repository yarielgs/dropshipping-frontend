export const environment = {
  production: true,
  URI_ROOT: 'https://api.dropshipping.bee-seller.com/pepeganga',
  URI_MELI: `http://auth.mercadolibre.com.uy/authorization?response_type=code&client_id=1737771850020695&state=${Math.floor(Math.random() * 100)}&redirect_uri=https://dropshipping.bee-seller.com/home/meli-accounts`,
  URI_MELI_PUBLIC: 'https://api.mercadolibre.com',
  URI_RESET_PASS: 'https://dropshipping.bee-seller.com/auth/reset',
  URI_UPLOAD_BUCKET: 'https://api.dropshipping.bee-seller.com/pepeganga/upload/api/bucket/download-file-from-upload-bucket?pathFile='
};
