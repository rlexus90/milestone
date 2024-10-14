import { loadFromStorage } from './lockalStorage';

export const chekIsLogin = () => {
  const user = loadFromStorage();
  if (user.token) return true;
  return false;
};
