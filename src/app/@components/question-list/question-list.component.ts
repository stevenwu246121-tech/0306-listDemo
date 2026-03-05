import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ListServiceService } from './../../@service/list-service.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, MatButtonModule],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.scss',
})
export class QuestionListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // 將 Service 注入移到這裡
  private listService = inject(ListServiceService);

  surveyId: number | null = null;
  // ngModel: any; // 這行如果沒用到可以刪除，HTML 裡用 option.selected 即可

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

  toggleAll(event: any, question: any) {
    const isChecked = event.target.checked;
    question.options.forEach((opt: any) => (opt.selected = isChecked));
  }

  isAnySelected(): boolean {
    return this.questions.some((q) => q.options.some((opt) => opt.selected));
  }

  submit() {
    if (this.surveyId === null) {
      alert('讀取問卷資訊錯誤！');
      return;
    }

    const resultData = this.questions.map((q) => ({
      questionTitle: q.title,
      selectedOptions: q.options
        .filter((opt) => opt.selected)
        .map((opt) => opt.label),
    }));

    // 呼叫 Service 儲存
    this.listService.setResult(this.surveyId, resultData);

    alert('問卷已成功送出！');
    this.router.navigate(['/table-list']);
  }

  goBack() {
    this.router.navigate(['/table-list']);
  }
}
