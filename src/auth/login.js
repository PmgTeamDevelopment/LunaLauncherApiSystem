import crypto from 'crypto';
import { setSession } from './session.js';

// Hàm login user
export function login(username, password) {
  const secret = process.env.LOGIN_SECRET || 'demo-secret';
  const hash = crypto.createHash('sha256').update(password + secret).digest('hex');

  // Demo check (sau này có thể replace bằng DB)
  if(username === 'yuki_player' && hash === crypto.createHash('sha256').update('password123'+secret).digest('hex')) {
    const token = crypto.randomBytes(16).toString('hex');

    const user = {
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      username: 'yuki_player',
      licenseStatus: 'active'
    };

    setSession(token, user); // lưu session trong memory
    return { token, user };
  } else {
    throw new Error('Invalid credentials');
  }
}
