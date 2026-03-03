import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListServiceService {

  // 使用 Signal 儲存使用者名稱，初始值為空
  currentUser = signal<string | null>(null);

  setUser(name: string) {
    this.currentUser.set(name);
  }

  logout() {
    this.currentUser.set(null);
  }
}

