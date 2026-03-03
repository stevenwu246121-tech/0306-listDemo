import { Routes } from '@angular/router';
import { TableListComponent } from './@components/table-list/table-list.component';
import { QuestionListComponent } from './@components/question-list/question-list.component';
import { LoginPageComponent } from './@components/login-page/login-page.component';

export const routes: Routes = [
  { path: 'table-list', component: TableListComponent },
  { path: 'question-list/:id', component: QuestionListComponent }, // 新增 :id 參數
  { path: 'login-page', component: LoginPageComponent },
  { path: '', redirectTo: '/login-page', pathMatch: 'full' }
];
