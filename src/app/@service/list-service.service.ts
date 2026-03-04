import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ListServiceService {
  // 初始值嘗試從 localStorage 抓取，防止重新整理後變回 null
  currentUser = signal<string | null>(localStorage.getItem('user_name'));

  private surveyResults = new Map<number, any>();
  setResult(surveyId: number, data: any) {
    this.surveyResults.set(surveyId, data);
    console.log(`問卷 ${surveyId} 已儲存`, data);
  }

  // 取得特定問卷的結果
  getResult(surveyId: number) {
    return this.surveyResults.get(surveyId);
  }

  // 判斷該問卷是否已經有結果
  hasResult(surveyId: number): boolean {
    return this.surveyResults.has(surveyId);
  }

  setUser(name: string) {
    localStorage.setItem('user_name', name); // 儲存到瀏覽器
    this.currentUser.set(name);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  logout() {
    localStorage.removeItem('user_name'); // 清除儲存
    this.currentUser.set(null);
  }
}
