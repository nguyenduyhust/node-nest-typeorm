import * as bcrypt from 'bcrypt';

export class EncryptHelper {
  static async hash(str: string, saltRounds = 10) {
    return await bcrypt.hash(str, saltRounds);
  }
  static compare(str: string, hash: string) {
    return bcrypt.compare(str, hash);
  }
}
