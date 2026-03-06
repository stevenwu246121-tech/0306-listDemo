import { Component, signal, inject } from '@angular/core'; // 1. 必須匯入 inject
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ListServiceService } from './../../@service/list-service.service';
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButton],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  private listService = inject(ListServiceService);
  private router = inject(Router);

  //使用Signals 儲存表單資料
  name = signal('');
  email = signal('');
  password = signal('');
  phone = signal('');

  //狀態控制
  isLoading = signal(false);
  message = signal({ text: '', type: '' });

  onLogin() {
    const loginEmail = this.email().trim();
    const loginPassword = this.password().trim();
    const loginName = this.name().trim() || '訪客';

    //防呆驗證
    if (!loginEmail || !loginPassword) {
      this.showMessage('請填寫信箱與密碼', 'error');
      return;
    }

    this.isLoading.set(true);

    setTimeout(() => {
      this.isLoading.set(false);

      if (loginName ==='admin' || loginPassword === '123' ) {
        // 管理者模式
        this.listService.setUser(loginName, 'ADMIN');
        this.router.navigate(['/table-list']);
      } else {
        // 一般訪客模式(密碼不是123&&不為空)
        this.listService.setUser(loginName, 'GUEST');
        this.router.navigate(['/table-list']);
      }
    }, 1000);
  }
  //方法定義
  private showMessage(text: string, type: string) {
    this.message.set({ text, type });
  }
}
