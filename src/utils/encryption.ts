import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

const encrypt = (buffer: Buffer): { iv: string; content: string } => {
  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const result = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { iv: iv.toString('hex'), content: result.toString('hex') };
};

const decrypt = (hash: { iv: string; content: string }): Buffer => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(hash.iv, 'hex'),
  );

  const result = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);


  return result;
};

export { encrypt, decrypt };
