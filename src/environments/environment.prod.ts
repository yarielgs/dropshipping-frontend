export const environment = {
  production: true,
  URI_ROOT: 'https://dev.pepeganga-api.com/pepeganga',
  URI_MELI: `http://auth.mercadolibre.com.uy/authorization?response_type=code&client_id=648079461510645&state=${Math.floor(Math.random() * 100)}&redirect_uri=https://drop-beeseller.web.app/home/meli-accounts`,
  URI_MELI_PUBLIC: 'https://api.mercadolibre.com',
  URI_RESET_PASS: 'https://drop-beeseller.web.app/auth/reset',
  URI_UPLOAD_BUCKET: 'https://dev.pepeganga-api.com/pepeganga/upload/api/bucket/download-file-from-upload-bucket?pathFile='
};
