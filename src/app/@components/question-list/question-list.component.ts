import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // 補上 MatDialog

// Services & Components
import { ListServiceService } from './../../@service/list-service.service';
import { DialogComponent, DialogData } from '../result-dialog/dialog.component';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.scss',
})
export class QuestionListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private listService = inject(ListServiceService);
  private dialog = inject(MatDialog); // 補上注入

  surveyId: number | null = null;

  @HostListener('window:pageshow', ['$event'])
  onPageShow(event: PageTransitionEvent) {
    if (event.persisted) {
      window.location.reload();
    }
  }

  questions = [
    {
      id: 'q1',
      title: '1. 您常用的通勤方式有哪些？',
      options: [
        { id: 'mrt', label: '捷運', selected: false },
        { id: 'bus', label: '公車', selected: false },
        { id: 'car', label: '自行開車', selected: false },
        { id: 'scooter', label: '騎機車', selected: false },
      ],
    },
    {
      id: 'q2',
      title: '2. 您通常在什麼時段通勤？',
      options: [
        { id: 'morning', label: '早上 (12:00以前)', selected: false },
        { id: 'afternoon', label: '下午 (12:00以後)', selected: false },
        { id: 'night', label: '深夜 (22:00後)', selected: false },
      ],
    },
  ];

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.surveyId = idParam ? Number(idParam) : null;
  }

  // 建議加上型別以符合專業架構
  toggleAll(event: Event, question: any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    question.options.forEach((opt: any) => (opt.selected = isChecked));
  }

  isAnySelected(): boolean {
    return this.questions.some((q) => q.options.some((opt) => opt.selected));
  }

  submit() {
    if (this.surveyId === null) {
      this.openDialog('message', '讀取失敗', '讀取問卷資訊錯誤！');
      return;
    }

    const resultData = this.questions.map((q) => ({
      questionTitle: q.title,
      selectedOptions: q.options
        .filter((opt) => opt.selected)
        .map((opt) => opt.label),
    }));

    // 儲存資料
    this.listService.setResult(this.surveyId, resultData);

    // 使用 Dialog 並處理關閉後的動作
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        type: 'message',
        title: '提交成功',
        message: '您的問卷已成功送出！'
      } as DialogData
    });

    // 重要：等使用者按下「關閉」才跳轉
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/table-list']);
    });
  }

  // 封裝常用彈窗邏輯
  private openDialog(type: 'message' | 'result', title: string, message: string) {
    this.dialog.open(DialogComponent, {
      width: '400px',
      data: { type, title, message } as DialogData
    });
  }

  goBack() {
    this.router.navigate(['/table-list']);
  }
}
