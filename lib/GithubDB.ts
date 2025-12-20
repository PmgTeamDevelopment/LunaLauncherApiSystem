export class GithubDB {
  private static token = process.env.GH_TOKEN;
  private static repo = "PmgTeamDevelopment/LunaLauncherApiSystem"; // Tên repo của bạn
  private static filePath = "src/data/users.json";

  // Hàm helper để tương tác với GitHub API
  private static async fetchGH(method: string, body?: any) {
    const url = `https://api.github.com/repos/${this.repo}/contents/${this.filePath}`;
    const headers = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
    };

    const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    return res.json();
  }

  // Lấy toàn bộ danh sách users
  static async getUsers() {
    const data = await this.fetchGH("GET");
    if (!data.content) return { users: [], sha: null };
    
    // GitHub trả về base64, cần giải mã
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { users: JSON.parse(content), sha: data.sha };
  }

  // Ghi đè danh sách users mới
  static async saveUser(newUser: any) {
    const { users, sha } = await this.getUsers();
    users.push(newUser);

    const content = Buffer.from(JSON.stringify(users, null, 2)).toString('base64');
    
    return await this.fetchGH("PUT", {
      message: `Update user: ${newUser.u}`,
      content: content,
      sha: sha // Cần SHA để GitHub xác nhận ghi đè
    });
  }
}
