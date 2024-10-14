import { CanActivateFn, Router } from '@angular/router';
import { chekIsLogin } from '../shared/helpers/isLogin';

export const guardsGuard: CanActivateFn = () => {
  const isLogin = chekIsLogin();
  if (!isLogin) new Router().navigate(['signin']);
  return isLogin;
};
