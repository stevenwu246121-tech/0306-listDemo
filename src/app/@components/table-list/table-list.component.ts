import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ListServiceService } from './../../@service/list-service.service';
import { DialogComponent } from '../result-dialog/dialog.component';


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
  // 確保這裡包含了所有需要的 Material 模組
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss'],
})
export class TableListComponent implements OnInit {
  // 統一使用 inject 或是 constructor，這裡建議 inject 保持風格一致
  private listService = inject(ListServiceService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  // 狀態變數
  userName = this.listService.currentUser; // Signal
  isAdministrator = false;
  selectedIds = new Set<number>();

  // 搜尋變數
  searchKeyword = '';
  startDateSearch = '';
  endDateSearch = '';

  // 資料源 (建議未來搬到 Service)
  private readonly MASTER_SURVEYS: Survey[] = [
    {id:1, name: '穿搭喜好調查', status: '進行中', startDate: '2026-03-03', endDate: '2026-06-25'},
    {id:2, name: '速食喜好調查', status: '進行中', startDate: '2026-03-03', endDate: '2026-06-25'},
    {id:3, name: '通勤手段調查', status: '進行中', startDate: '2026-03-03', endDate: '2026-06-25'},
    {id:4, name: '休閒活動調查', status: '尚未發佈', startDate: '2026-03-31', endDate: '2026-06-25'},
    {id:5, name: '動漫喜好調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25'},
    {id:6, name: '鹹酥雞選料調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25'},
    {id:7, name: '公司福利喜好調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25'},
    {id:8, name: 'xxx調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25'},
    {id:9, name: 'xxx調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25'},
    {id:10, name: 'xxx調查', status: '未開始', startDate: '2026-04-01', endDate: '2026-06-25'},
  ];

  surveys = [...this.MASTER_SURVEYS];

  ngOnInit() {
    // 登入守衛
    if (!this.listService.isLoggedIn()) {
      this.router.navigate(['/login-page']);
      return;
    }
    this.isAdministrator = this.listService.isAdmin();
  }

  // --- 功能方法 ---
  onStartDateChange() {
    if (this.endDateSearch && this.startDateSearch > this.endDateSearch) {
      alert('「開始日期」不能晚於「結束日期」。');
      this.startDateSearch = '';
    }
  }

  onEndDateChange() {
    if (this.startDateSearch && this.endDateSearch < this.startDateSearch) {
      alert('「結束日期」不能早於「開始日期」。');
      this.endDateSearch = '';
    }
  }

  onSearch() {
    const keyword = this.searchKeyword.trim().toLowerCase();
    if (this.startDateSearch && this.endDateSearch && this.startDateSearch > this.endDateSearch) {
      alert('搜尋區間無效');
      return;
    }

    this.surveys = this.MASTER_SURVEYS.filter((s) => {
      const matchesName = keyword ? s.name.toLowerCase().includes(keyword) : true;
      const isAfterStart = this.startDateSearch ? s.startDate >= this.startDateSearch : true;
      const isBeforeEnd = this.endDateSearch ? s.startDate <= this.endDateSearch : true;
      return matchesName && isAfterStart && isBeforeEnd;
    });
  }

  onReset() {
    this.searchKeyword = '';
    this.startDateSearch = '';
    this.endDateSearch = '';
    this.surveys = [...this.MASTER_SURVEYS];
    this.selectedIds.clear();
  }

  onDeleteSelected() {
    if (this.selectedIds.size === 0) return;
    if (confirm(`確定要刪除選中的 ${this.selectedIds.size} 筆資料嗎？`)) {
      // 這裡刪除的是組件內的 local surveys，若要永久刪除應呼叫 service
      this.surveys = this.surveys.filter(s => !this.selectedIds.has(s.id));
      this.selectedIds.clear();
      alert('刪除成功');
    }
  }

  viewResult(survey: Survey) {
    const result = this.listService.getResult(survey.id);
    if (!result) {
      alert('找不到填寫結果');
      return;
    }

    this.dialog.open(DialogComponent, {
  width: '550px',
  data: {
    type: 'result',
    title: '問卷詳細結果',
    surveyResults: result // 這是從 Service 抓到的結果陣列
  }
});
  }

  // --- 輔助方法 ---

  getDynamicStatus(survey: Survey) {
    if (this.hasResult(survey.id)) return 'status-completed';
    const now = new Date().toISOString().split('T')[0];
    if (survey.status === '尚未發佈') return 'status-pending';
    if (now < survey.startDate) return 'status-not-start';
    if (now > survey.endDate) return 'status-end';
    return 'status-running';
  }

  onCheckboxChange(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    checked ? this.selectedIds.add(id) : this.selectedIds.delete(id);
  }

  logout() {
    this.listService.logout();
    this.router.navigate(['/login-page'], { replaceUrl: true });
  }

  goToQuestion(survey: Survey) {
    if (survey.name === '通勤手段調查') {
      this.router.navigate(['/question-list', survey.id]);
    }
  }

  onNameClick(survey: Survey) {
    this.goToQuestion(survey);
  }

  hasResult(id: number): boolean {
    return this.listService.hasResult(id);
  }
}
