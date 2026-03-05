import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ListServiceService {
  // 初始值嘗試從 localStorage 抓取
  currentUser = signal<string | null>(localStorage.getItem('user_name'));
  userRole = signal<string | null>(localStorage.getItem('user_role'));

  private surveyResults = new Map<number, any[]>();

  setResult(surveyId: number, data: any[]) {
    this.surveyResults.set(surveyId, data);
    // 可選：存入 localStorage 確保重新整理後結果還在
    localStorage.setItem(`result_${surveyId}`, JSON.stringify(data));
  }

  getResult(surveyId: number) {
    // 如果記憶體沒有，嘗試從 localStorage 抓
    const saved = localStorage.getItem(`result_${surveyId}`);
    return (
      this.surveyResults.get(surveyId) || (saved ? JSON.parse(saved) : null)
    );
  }

  hasResult(surveyId: number): boolean {
    return (
      this.surveyResults.has(surveyId) ||
      localStorage.getItem(`result_${surveyId}`) !== null
    );
  }

  // 修改 setUser，讓它能接收角色（ADMIN 或 GUEST）
  setUser(name: string, role: 'ADMIN' | 'GUEST') {
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_role', role); // 儲存角色到瀏覽器
    this.currentUser.set(name);
    this.userRole.set(role);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  // 新增：管理者判斷工具
  isAdmin(): boolean {
    return this.userRole() === 'ADMIN';
  }

  logout() {
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role'); // 清除角色儲存
    this.currentUser.set(null);
    this.userRole.set(null);
  }
}
