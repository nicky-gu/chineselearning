import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-please-change-in-production'

export function encryptData(data: any, key: string = ENCRYPTION_KEY): string {
  try {
    const jsonString = JSON.stringify(data)
    const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString()
    return encrypted
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

export function decryptData<T>(encryptedData: string, key: string = ENCRYPTION_KEY): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    if (!decryptedString) {
      return null
    }
    return JSON.parse(decryptedString) as T
  } catch (error) {
    console.error('Decryption error:', error)
    return null
  }
}

export function hashPin(pin: string): string {
  return CryptoJS.SHA256(pin).toString()
}
