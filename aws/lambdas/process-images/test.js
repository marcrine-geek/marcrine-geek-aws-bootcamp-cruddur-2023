const {getClient, getOriginalImage, processImage, uploadProcessedImage} = require('./s3-image-processing.js')

async function main(){
  client = getClient()
  const srcBucket = 'cruddur-uploaded-avatars-marcrine'
  const srcKey = 'avatar/original/data.jpg'
  const dstBucket = 'cruddur-uploaded-avatars-marcrine'
  const dstKey = 'avatar/processed/data.png'
  const width = 256
  const height = 256

  const originalImage = await getOriginalImage(client,srcBucket,srcKey)
  console.log(originalImage)
  const processedImage = await processImage(originalImage,width,height)
  await uploadProcessedImage(dstBucket,dstKey,processedImage)
}

main()
