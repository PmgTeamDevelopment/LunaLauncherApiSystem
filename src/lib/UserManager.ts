import fs from 'fs';
import path from 'path';
import { AuthSystem } from './AuthSystem';

const DB_PATH = path.join(process.cwd(), 'src/data/users.json');

export class UserManager {
  // Lấy danh sách user từ file
  private static getUsers(): any[] {
    if (!fs.existsSync(DB_PATH)) return [];
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  }

  // Xử lý Đăng nhập
  static async authenticate(username: string, pass: string, hwid: string) {
    const users = this.getUsers();
    const user = users.find(u => u.u === username);

    if (!user) throw new Error("Tài khoản không tồn tại");
    if (user.id !== hwid) throw new Error("Hardware ID không khớp");

    const isMatch = AuthSystem.hashPassword(pass, user.s) === user.p;
    if (!isMatch) throw new Error("Mật khẩu không chính xác");

    // Trả về Token và License
    return {
      token: AuthSystem.generateLavaToken(user.u, user.l),
      license: user.l
    };
  }

  // Xử lý Đăng ký (Signup)
  static async register(username: string, pass: string, hwid: string, license: string) {
    const users = this.getUsers();
    if (users.some(u => u.u === username)) throw new Error("Tài khoản đã tồn tại");

    const salt = AuthSystem.generateSalt();
    const newUser = {
      u: username,
      p: AuthSystem.hashPassword(pass, salt),
      s: salt,
      id: hwid,
      l: license
    };

    // Lưu ý: Trên Vercel việc ghi file này sẽ không tồn tại sau khi tắt server
    // Minh nên dùng Upstash Redis nếu muốn signup hoạt động thực tế
    users.push(newUser);
    // fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2)); 
    
    return { success: true };
  }
}
