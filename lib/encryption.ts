import CryptoJS from 'crypto-js'

const DEFAULT_ENCRYPTION_KEY = 'default-key-please-change-in-production'
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || DEFAULT_ENCRYPTION_KEY

export function encryptData(data: unknown, key: string = ENCRYPTION_KEY): string {
  const jsonString = JSON.stringify(data)
  const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString()
  return encrypted
}

export function decryptData<T>(encryptedData: string, key: string = ENCRYPTION_KEY): T | null {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key)
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8)

  if (!decryptedString) {
    return null
  }

  return JSON.parse(decryptedString) as T
}

export function hashPin(pin: string): string {
  return CryptoJS.SHA256(pin).toString()
}
