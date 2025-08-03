import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const SALT_LENGTH = 64
const TAG_LENGTH = 16
const KEY_LENGTH = 32
const ITERATION_COUNT = 100000

function deriveKey(secret: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(secret, salt, ITERATION_COUNT, KEY_LENGTH, 'sha256')
}

export function encrypt(text: string, secret: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH)
  const key = deriveKey(secret, salt)
  
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final()
  ])
  
  const tag = cipher.getAuthTag()
  
  const combined = Buffer.concat([
    salt,
    iv,
    tag,
    encrypted
  ])
  
  return combined.toString('base64')
}

export function decrypt(encryptedText: string, secret: string): string {
  const combined = Buffer.from(encryptedText, 'base64')
  
  const salt = combined.slice(0, SALT_LENGTH)
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + 16)
  const tag = combined.slice(SALT_LENGTH + 16, SALT_LENGTH + 16 + TAG_LENGTH)
  const encrypted = combined.slice(SALT_LENGTH + 16 + TAG_LENGTH)
  
  const key = deriveKey(secret, salt)
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final()
  ])
  
  return decrypted.toString('utf8')
}