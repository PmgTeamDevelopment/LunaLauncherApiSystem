import { GithubDB } from './GithubDB';
import { AuthSystem } from './AuthSystem';

export class UserManager {
  static async register(username: string, pass: string, hwid: string, key: string) {
    const { users } = await GithubDB.getUsers();
    
    if (users.find((u: any) => u.u === username)) {
      throw new Error("Tài khoản đã tồn tại!");
    }

    const salt = AuthSystem.generateSalt();
    const newUser = {
      u: username,
      p: AuthSystem.hashPassword(pass, salt),
      s: salt,
      id: hwid,
      l: key || 'basic'
    };

    await GithubDB.saveUser(newUser);
    return { success: true };
  }

  static async authenticate(username: string, pass: string, hwid: string) {
    const { users } = await GithubDB.getUsers();
    const user = users.find((u: any) => u.u === username);

    if (!user) throw new Error("Tài khoản không tồn tại");
    // Thêm kiểm tra HWID nếu cần
    
    const isMatch = AuthSystem.hashPassword(pass, user.s) === user.p;
    if (!isMatch) throw new Error("Mật khẩu sai");

    return {
      token: AuthSystem.generateLavaToken(user.u, user.l),
      license: user.l
    };
  }
}
