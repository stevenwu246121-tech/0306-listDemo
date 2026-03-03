import { Component, signal, inject } from '@angular/core'; // 1. 必須匯入 inject
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ListServiceService } from './../../@service/list-service.service';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  private listService = inject(ListServiceService);
  private router = inject(Router);
  // 使用 Signals 儲存表單資料
  name = signal('');
  email = signal('');
  password = signal('');
  phone = signal('');

  // 狀態控制
  isLoading = signal(false);
  message = signal({ text: '', type: '' }); // type: 'success' | 'error'

  onLogin() {
    // 基本驗證
    if (!this.email() || !this.password()) {
      this.showMessage('請填寫信箱與密碼', 'error');
      return;
    }

    this.isLoading.set(true);
    this.message.set({ text: '登入驗證中...', type: 'info' });

    // 模擬 API 請求 (2秒後回傳結果)
    setTimeout(() => {
      this.isLoading.set(false);

      // 這裡寫你的登入邏輯，現在先假設密碼是 "1234" 就成功
      if (this.password() === '1234') {
        // this.showMessage(`歡迎回來，${this.name()}！登入成功`, 'success');
        // 這裡可以執行路由跳轉：this.router.navigate(['/survey']);
        // 假設驗證成功
    this.listService.setUser(this.name()); // 存入 Service
    this.router.navigate(['/table-list']); // 跳轉到 Page 2
      } else {
        this.showMessage('登入失敗：帳號或密碼錯誤', 'error');
      }
    }, 2000);
  }

  private showMessage(text: string, type: string) {
    this.message.set({ text, type });
  }
}
