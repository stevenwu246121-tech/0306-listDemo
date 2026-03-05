import { ListServiceService } from './../../@service/list-service.service';
import { Component, inject, OnInit } from '@angular/core';
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
  imports: [CommonModule,MatIconModule,FormsModule,MatToolbarModule,MatButtonModule,],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
})
export class TableListComponent implements OnInit {
  private listService = inject(ListServiceService);
  private router = inject(Router);

  // 取得 Service 中的 Signal 值 (注意：如果 Service 用 Signal，這裡要加括號讀取)
  userName = this.listService.currentUser;
  isAdministrator = false;
  selectedIds = new Set<number>();

  searchKeyword = '';
  startDateSearch = '';
  endDateSearch = '';

  private readonly MASTER_SURVEYS: Survey[] = [
    {id:1, name: '穿搭喜好調查', status: '進行中', startDate: '2026-03-03', endDate: '2026-06-25'},
    {id:2, name: '速食喜好調查', status: '進行中', startDate: '2026-03-03', endDate: '2026-06-25'},
    {id:3, name: '通勤手段問卷調查', status: '進行中', startDate: '2026-03-03', endDate: '2026-06-25'},
    {id:4, name: '休閒活動調查', status: '尚未發佈', startDate: '2026-03-31', endDate: '2026-06-25'},
    {id:5, name: '動漫喜好調查問卷', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25'},
    {id:6, name: '鹹酥雞選料調查', status: '未開始', startDate: '2026-03-06', endDate: '2026-06-25'},
    {id:7, name: '公司福利喜好調查', status: '未開始', startDate: '2026-03-06', endDate: '2026-06-25'},
    {id:8, name: 'xxx調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25'},
    {id:9, name: 'xxx調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25'},
    {id:10, name: 'xxx調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25'},
  ];

  surveys = [...this.MASTER_SURVEYS];

  ngOnInit() {
  // 不再寫死姓名判斷，改用 Service 提供的角色判斷方法
  this.isAdministrator = this.listService.isAdmin();
}
  // 處理勾選
  onCheckboxChange(id: number, event: any) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
  }

  // 執行刪除
  onDeleteSelected() {
    if (this.selectedIds.size === 0) return;
    if (confirm(`確定要刪除選中的 ${this.selectedIds.size} 筆資料嗎？`)) {
      this.surveys = this.surveys.filter(s => !this.selectedIds.has(s.id));
      this.selectedIds.clear();
      alert('刪除成功');
    }
  }

  // 搜尋功能
  onSearch() {
    if (this.startDateSearch && this.endDateSearch && this.startDateSearch > this.endDateSearch) {
      alert('搜尋區間無效：開始日期大於結束日期。');
      return;
    }

    this.surveys = this.MASTER_SURVEYS.filter((s) => {
      const matchesName = s.name.toLowerCase().includes(this.searchKeyword.toLowerCase());
      const isAfterStart = this.startDateSearch ? s.startDate >= this.startDateSearch : true;
      const isBeforeEnd = this.endDateSearch ? s.startDate <= this.endDateSearch : true;
      return matchesName && isAfterStart && isBeforeEnd;
    });
  }

  // ... (其餘 method 如 onReset, getDynamicStatus, logout 等保持不變)
  onReset() {
    this.searchKeyword = '';
    this.startDateSearch = '';
    this.endDateSearch = '';
    this.surveys = [...this.MASTER_SURVEYS];
    this.selectedIds.clear();
  }

  getDynamicStatus(survey: any) {
    if (this.hasResult(survey.id)) return 'status-completed';
    const now = new Date().toISOString().split('T')[0];
    if (survey.status === '尚未發佈') return 'status-pending';
    if (now < survey.startDate) return 'status-not-start';
    if (now > survey.endDate) return 'status-end';
    return 'status-running';
  }

  onStartDateChange() {
    if (this.endDateSearch && this.startDateSearch > this.endDateSearch) {
      alert('「開始日期」不能晚於「結束日期」。');
      this.endDateSearch = '';
    }
  }

  onEndDateChange() {
    if (this.startDateSearch && this.endDateSearch < this.startDateSearch) {
      alert('「結束日期」不能早於「開始日期」。');
      this.startDateSearch = '';
    }
  }

  logout() {
    this.listService.logout();
    this.router.navigate(['/login-page'], { replaceUrl: true });
  }

  onNameClick(survey: Survey) {
    if (survey.name === '通勤手段問卷調查') {
      this.router.navigate(['/question-list', survey.id]);
    }
  }

  goToQuestion(survey: Survey) {
    if (survey.name === '通勤手段問卷調查') {
      this.router.navigate(['/question-list', survey.id]);
    }
  }

  hasResult(id: number): boolean { return this.listService.hasResult(id); }

  // 查看結果的方法
viewResult(survey: any) {
  const result = this.listService.getResult(survey.id);
  if (!result) {
    alert('找不到填寫結果');
    return;
  }

  // 格式化顯示訊息 (可以使用 JSON.stringify 或是迴圈組合字串)
  let detailString = `【${survey.name}】您的回覆內容：\n\n`;

  result.forEach((item: any, index: number) => {
    const answers = item.selectedOptions.length > 0
                    ? item.selectedOptions.join('、')
                    : '未填寫';
    detailString += `問題 ${index + 1}：${item.questionTitle}\n`;
    detailString += `回答：${answers}\n`;
    detailString += `--------------------------\n`;
  });

  alert(detailString);
  // 進階作法：可以使用 Angular Material Dialog 彈出漂亮的小視窗
}
}
