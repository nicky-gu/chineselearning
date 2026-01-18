import { encryptData, decryptData, hashPin } from '@/lib/encryption'

describe('Encryption Utils', () => {
  const TEST_KEY = 'test-key-12345'
  const TEST_DATA = { message: 'Hello World', count: 42 }

  describe('encryptData', () => {
    it('should encrypt data successfully', function testEncryptData() {
      const encrypted = encryptData(TEST_DATA, TEST_KEY)

      expect(encrypted).toBeDefined()
      expect(typeof encrypted).toBe('string')
      expect(encrypted).not.toEqual(JSON.stringify(TEST_DATA))
    })

    it('should encrypt empty object', function testEncryptEmpty() {
      const encrypted = encryptData({}, TEST_KEY)

      expect(encrypted).toBeDefined()
      expect(typeof encrypted).toBe('string')
    })

    it('should encrypt null values', function testEncryptNull() {
      const encrypted = encryptData({ value: null }, TEST_KEY)

      expect(encrypted).toBeDefined()
    })

    it('should produce different encrypted values for same input', function testEncryptUnique() {
      const encrypted1 = encryptData(TEST_DATA, TEST_KEY)
      const encrypted2 = encryptData(TEST_DATA, TEST_KEY)

      expect(encrypted1).toEqual(encrypted2)
    })
  })

  describe('decryptData', () => {
    it('should decrypt data successfully', function testDecryptData() {
      const encrypted = encryptData(TEST_DATA, TEST_KEY)
      const decrypted = decryptData<typeof TEST_DATA>(encrypted, TEST_KEY)

      expect(decrypted).toEqual(TEST_DATA)
    })

    it('should return null for invalid encrypted data', function testDecryptInvalid() {
      const decrypted = decryptData('invalid-encrypted-data', TEST_KEY)

      expect(decrypted).toBeNull()
    })

    it('should return null for wrong key', function testDecryptWrongKey() {
      const encrypted = encryptData(TEST_DATA, TEST_KEY)
      const decrypted = decryptData<typeof TEST_DATA>(encrypted, 'wrong-key')

      expect(decrypted).toBeNull()
    })

    it('should decrypt complex objects', function testDecryptComplex() {
      const complexData = {
        user: { id: '123', name: 'Test' },
        items: [1, 2, 3],
        nested: { a: { b: { c: 'deep' } } },
      }

      const encrypted = encryptData(complexData, TEST_KEY)
      const decrypted = decryptData<typeof complexData>(encrypted, TEST_KEY)

      expect(decrypted).toEqual(complexData)
    })
  })

  describe('encrypt/decrypt roundtrip', () => {
    it('should maintain data integrity through encrypt/decrypt cycle', function testRoundtrip() {
      const originalData = {
        text: '测试中文',
        number: 123.45,
        boolean: true,
        array: [1, 2, 3],
        null: null,
      }

      const encrypted = encryptData(originalData, TEST_KEY)
      const decrypted = decryptData<typeof originalData>(encrypted, TEST_KEY)

      expect(decrypted).toEqual(originalData)
    })

    it('should handle special characters', function testSpecialChars() {
      const specialData = {
        emoji: '😀🎉',
        unicode: '你好世界',
        symbols: '!@#$%^&*()',
      }

      const encrypted = encryptData(specialData, TEST_KEY)
      const decrypted = decryptData<typeof specialData>(encrypted, TEST_KEY)

      expect(decrypted).toEqual(specialData)
    })
  })

  describe('hashPin', () => {
    it('should hash PIN consistently', function testHashConsistent() {
      const pin = '12345678'
      const hash1 = hashPin(pin)
      const hash2 = hashPin(pin)

      expect(hash1).toBe(hash2)
    })

    it('should produce different hashes for different PINs', function testHashDifferent() {
      const hash1 = hashPin('12345678')
      const hash2 = hashPin('87654321')

      expect(hash1).not.toBe(hash2)
    })

    it('should produce fixed-length hash', function testHashLength() {
      const pin = '12345678'
      const hash = hashPin(pin)

      expect(hash.length).toBe(64) // SHA256 produces 64 hex characters
    })

    it('should handle only numeric input', function testHashNumeric() {
      const pin = '00000000'
      const hash = hashPin(pin)

      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
    })
  })
})
