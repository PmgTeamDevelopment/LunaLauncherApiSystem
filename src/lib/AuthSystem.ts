import { createHmac, randomBytes } from 'crypto';

export interface UserSession {
  u: string;
  l: string;
  exp: number;
}

export class AuthSystem {
  private static PEPPER = process.env.LUNA_PEPPER || 'phèn_bí_mật_123';

  // 1. Tạo Salt ngẫu nhiên cho User mới
  static generateSalt(): string {
    return randomBytes(16).toString('hex');
  }

  // 2. Mã hóa mật khẩu (PBKDF2 style đơn giản)
  static hashPassword(password: string, salt: string): string {
    return createHmac('sha256', salt)
      .update(password + this.PEPPER)
      .digest('hex');
  }

  // 3. Tạo Token "Đèn dung nham" 2 tiếng
  static generateLavaToken(username: string, license: string): string {
    const payload: UserSession = {
      u: username,
      l: license,
      exp: Date.now() + 2 * 60 * 60 * 1000 // + 2 giờ
    };

    const data = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = createHmac('sha256', this.PEPPER).update(data).digest('hex');

    return `${data}.${signature}`;
  }

  // 4. Giải mã và Kiểm tra Token (Middleware dùng cái này)
  static verifyToken(token: string): UserSession | null {
    try {
      const [data, sig] = token.split('.');
      const expectedSig = createHmac('sha256', this.PEPPER).update(data).digest('hex');

      if (sig !== expectedSig) return null;

      const session: UserSession = JSON.parse(Buffer.from(data, 'base64').toString());
      
      if (Date.now() > session.exp) return null; // Hết hạn 2h

      return session;
    } catch {
      return null;
    }
  }
}
