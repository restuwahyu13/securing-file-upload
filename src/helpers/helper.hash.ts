import crypto from 'crypto'

export const symmetricHash = (data: crypto.BinaryLike, encoding: crypto.BinaryToTextEncoding): string => {
  const symmetricSignature: crypto.Hmac = crypto.createHmac('SHA512', process.env.HASH_SECRET!)
  symmetricSignature.update(data)
  return symmetricSignature.digest(encoding).toString()
}
