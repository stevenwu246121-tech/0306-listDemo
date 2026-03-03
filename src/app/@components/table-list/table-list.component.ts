import { ListServiceService } from './../../@service/list-service.service';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Survey {
  id: number;
  name: string;
  status: '進行中' | '尚未發佈' | '未開始' | '已結束';
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule], // 2. 加入 FormsModule
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent {
  private listService = inject(ListServiceService);
  private router = inject(Router);

  userName = this.listService.currentUser;

  private readonly MASTER_SURVEYS: Survey[] = [
    { id: 1, name: '穿搭喜好調查', status: '進行中', startDate: '2026-03-03', endDate: '2026-06-25' },
    { id: 2, name: '速食喜好調查', status: '進行中', startDate: '2026-03-03', endDate: '2026-06-25' },
    { id: 3, name: '通勤手段問卷調查', status: '進行中', startDate: '2026-03-03', endDate: '2026-06-25' },
    { id: 4, name: '休閒活動調查', status: '尚未發佈', startDate: '2026-03-31', endDate: '2026-06-25' },
    { id: 5, name: '動漫喜好調查問卷', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25' },
    { id: 6, name: '鹹酥雞選料調查', status: '未開始', startDate: '2026-03-06', endDate: '2026-06-25' },
    { id: 7, name: '公司福利喜好調查', status: '未開始', startDate: '2026-03-06', endDate: '2026-06-25' },
    { id: 8, name: 'xxx調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25' },
    { id: 9, name: 'xxx調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25' },
    { id: 10, name: 'xxx調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25' },
  ];

  surveys = [...this.MASTER_SURVEYS];

  onNameClick(survey: Survey) {
    if (survey.name === '通勤手段問卷調查') {
      // 導向問卷頁面，並傳遞 ID
      this.router.navigate(['/question-list', survey.id]);
    } else {
      console.log('尚未實作此問卷內容');
    }
  }

  /**
   * 自動判斷狀態 (進階功能)
   * 根據今天的日期與開始/結束日期比對，回傳正確的狀態 Class
   */
  getDynamicStatus(survey: Survey) {
    const now = new Date().toISOString().split('T')[0]; // 取得今天日期 '2026-03-03'

    if (survey.status === '尚未發佈') return 'status-pending';
    if (now < survey.startDate) return 'status-not-start';
    if (now > survey.endDate) return 'status-end';
    return 'status-running'; // 在區間內
  }

  searchKeyword = '';
  // 新增：日期搜尋範圍變數
  startDateSearch = '';
  endDateSearch = '';

  onSearch() {
    this.surveys = this.MASTER_SURVEYS.filter(s => {
      // 1. 名稱篩選
      const matchesName = s.name.toLowerCase().includes(this.searchKeyword.toLowerCase());

      // 2. 日期篩選 (比對 startDate 是否在區間內)
      // 若未輸入日期則預設為 true (不參與篩選)
      const surveyDate = s.startDate; // 格式為 '2026-03-06'

      const isAfterStart = this.startDateSearch ? surveyDate >= this.startDateSearch : true;
      const isBeforeEnd = this.endDateSearch ? surveyDate <= this.endDateSearch : true;

      return matchesName && isAfterStart && isBeforeEnd;
    });
  }

  onReset() {
    this.searchKeyword = '';
    this.startDateSearch = ''; // 清除起始日期
    this.endDateSearch = '';   // 清除結束日期
    this.surveys = [...this.MASTER_SURVEYS];
    console.log('列表與日期已重設');
  }

  getStatusClass(status: Survey['status']) {
    return {
      'status-running': status === '進行中',
      'status-pending': status === '尚未發佈',
      'status-not-start': status === '未開始',
      'status-end': status === '已結束'
    };
  }

  logout() {
    this.listService.logout();
    this.router.navigate(['/login-page']); // 導向登入頁面
  }

  // table-list.component.ts 裡的方法
goToQuestion(survey: Survey) {
  // 邏輯 1：如果是點擊「通勤手段問卷調查」，直接導向 question-list
  if (survey.name === '通勤手段問卷調查') {
    this.router.navigate(['/question-list', survey.id]);
  } else {
    // 邏輯 2：其他問卷暫時不做動作，或跳出提示
    console.log('此問卷尚未開發：', survey.name);
    // alert('目前僅開放「通勤手段問卷調查」填寫');
  }
}
}
