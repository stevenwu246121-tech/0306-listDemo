import { ListServiceService } from './../../@service/list-service.service';
import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

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
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
})
export class TableListComponent {
  private listService = inject(ListServiceService);
  private router = inject(Router);

  userName = this.listService.currentUser;

  private readonly MASTER_SURVEYS: Survey[] = [
    {id:1,name: '穿搭喜好調查',status: '進行中',startDate: '2026-03-03',endDate: '2026-06-25',},
    {id:2,name: '速食喜好調查',status: '進行中',startDate: '2026-03-03',endDate: '2026-06-25',},
    {id:3,name: '通勤手段問卷調查',status: '進行中',startDate: '2026-03-03',endDate: '2026-06-25',},
    {id:4,name: '休閒活動調查',status: '尚未發佈',startDate: '2026-03-31',endDate: '2026-06-25',},
    {id:5,name: '動漫喜好調查問卷',status: '未開始',startDate: '2026-04-01',endDate: '2026-06-25',},
    {id:6,name: '鹹酥雞選料調查',status: '未開始',startDate: '2026-03-06',endDate: '2026-06-25',},
    {id:7,name: '公司福利喜好調查',status: '未開始',startDate: '2026-03-06',endDate: '2026-06-25',},
    {id:8,name: 'xxx調查',status: '未開始',startDate: '2026-04-01',endDate: '2026-06-25',},
    {id:9,name: 'xxx調查',status: '未開始',startDate: '2026-04-01',endDate: '2026-06-25',},
    {id:10,name: 'xxx調查',status: '未開始',startDate: '2026-04-01',endDate: '2026-06-25',},
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

  //自動判斷狀態，根據今天的日期與開始/結束日期比對，回傳正確的狀態 Class
  getDynamicStatus(survey: any) {
    if (this.hasResult(survey.id)) return 'status-completed';
    const now = new Date().toISOString().split('T')[0]; // 取得今天日期 '2026-03-03'

    if (survey.status === '尚未發佈') return 'status-pending';
    if (now < survey.startDate) return 'status-not-start';
    if (now > survey.endDate) return 'status-end';
    return 'status-running'; // 在區間內
  }

  searchKeyword = '';
  startDateSearch = '';
  endDateSearch = '';

  onStartDateChange() {
    if (this.endDateSearch && this.startDateSearch > this.endDateSearch) {
      alert('「開始日期」不能晚於「結束日期」，系統已自動為您重設。');
      this.endDateSearch = ''; // 清空不合理的結束日期
    }
  }

  onEndDateChange() {
    // 防呆：如果開始日期已經有值，且比新的結束日期還晚
    if (this.startDateSearch && this.endDateSearch < this.startDateSearch) {
      alert('「結束日期」不能早於「開始日期」，系統已自動為您重設。');
      this.startDateSearch = ''; // 清空不合理的開始日期
    }
  }

  onSearch() {
    // 額外防呆：如果使用者手動輸入了錯誤的邏輯（繞過選取器）
    if (
      this.startDateSearch &&
      this.endDateSearch &&
      this.startDateSearch > this.endDateSearch
    ) {
      alert('搜尋區間無效：開始日期大於結束日期。');
      return;
    }

    this.surveys = this.MASTER_SURVEYS.filter((s) => {
      const matchesName = s.name
        .toLowerCase()
        .includes(this.searchKeyword.toLowerCase());
      const surveyDate = s.startDate;

      const isAfterStart = this.startDateSearch
        ? surveyDate >= this.startDateSearch
        : true;
      const isBeforeEnd = this.endDateSearch
        ? surveyDate <= this.endDateSearch
        : true;

      return matchesName && isAfterStart && isBeforeEnd;
    });
  }

  onReset() {
    this.searchKeyword = '';
    this.startDateSearch = ''; // 清除起始日期
    this.endDateSearch = ''; // 清除結束日期
    this.surveys = [...this.MASTER_SURVEYS];
    console.log('列表與日期已重設');
  }

  getStatusClass(status: Survey['status']) {
    return {
      'status-running': status === '進行中',
      'status-pending': status === '尚未發佈',
      'status-not-start': status === '未開始',
      'status-end': status === '已結束',
    };
  }

  logout() {
    this.listService.logout();
    // replaceUrl: true 讓使用者按「上一頁」回不來
    this.router.navigate(['/login-page'], { replaceUrl: true });
  }

  goToQuestion(survey: Survey) {
    // 檢查是否為「通勤手段問卷調查」
    if (survey.name === '通勤手段問卷調查') {
      this.router.navigate(['/question-list', survey.id]);
    } else {
      console.log('此問卷尚未開發，取消跳轉：', survey.name);
      // 加提示讓使用者知道為什麼沒反應
      // alert('此問卷目前尚未開放填寫');
    }
  }

  // 檢查問卷是否已填寫
  hasResult(id: number): boolean {
    return this.listService.hasResult(id);
  }

  // 2. 顯示結果為alert，可以根據需求改成 Dialog
  viewResult(survey: any) {
    const result = this.listService.getResult(survey.id);
    if (!result) return;

    let displayMsg = `【${survey.name}】的回覆結果：\n\n`;

    result.forEach((item: any, index: number) => {
      displayMsg += `${index + 1}. ${item.questionTitle}\n`;
      displayMsg += `   回答：${item.selectedOptions.join(', ') || '未填寫'}\n\n`;
    });

    alert(displayMsg);
  }
}
