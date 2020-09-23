import cryptoJs from 'crypto-js'

// DES加密
export const encryptDes = (message, key, iv) => {
  var keyHex = cryptoJs.enc.Utf8.parse(key)
  var ivHex = cryptoJs.enc.Utf8.parse(iv)
  var option = { iv: ivHex, mode: cryptoJs.mode.CBC, padding: cryptoJs.pad.Pkcs7 }
  var encrypted = cryptoJs.DES.encrypt(message, keyHex, option)
  return encrypted.ciphertext.toString()
}

// DES解密
export const decryptDes = (message, key, iv) => {
  var keyHex = cryptoJs.enc.Utf8.parse(key)
  var ivHex = cryptoJs.enc.Utf8.parse(iv)
  var decrypted = cryptoJs.DES.decrypt(
    {
      ciphertext: cryptoJs.enc.Hex.parse(message)
    },
    keyHex,
    {
      iv: ivHex,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7
    }
  )
  return decrypted.toString(cryptoJs.enc.Utf8)
}
