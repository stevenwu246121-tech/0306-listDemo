import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ListServiceService } from './@service/list-service.service';

export const authGuard: CanActivateFn = (route, state) => {
  const listService = inject(ListServiceService);
  const router = inject(Router);

  // 假設你的 service 有一個判斷是否登入的方法
  if (listService.isLoggedIn()) {
    return true;
  } else {
    // 未登入，導向登入頁並回傳 false 阻止進入
    router.navigate(['/login-page']);
    return false;
  }
};
