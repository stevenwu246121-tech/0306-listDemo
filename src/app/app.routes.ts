import { Routes } from '@angular/router';
import { TableListComponent } from './@components/table-list/table-list.component';
import { QuestionListComponent } from './@components/question-list/question-list.component';
import { LoginPageComponent } from './@components/login-page/login-page.component';
// 1. 匯入你剛建立好的 Guard
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {path:'table-list',component: TableListComponent,canActivate:[authGuard]},
  {path:'question-list/:id',component: QuestionListComponent,canActivate:[authGuard]},
  { path:'login-page', component: LoginPageComponent},
  // 加一個預設路徑，如果網址空白就導向登入
  { path:'', redirectTo:'login-page', pathMatch:'full'}
];
