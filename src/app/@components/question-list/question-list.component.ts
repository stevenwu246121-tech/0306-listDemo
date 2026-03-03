import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question-list',
  standalone: true, // 確保為 Standalone 組件
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.scss'
})
export class QuestionListComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  surveyId: number | null = null;

  ngOnInit() {
    // 取得網址上的 id
    this.surveyId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('當前問卷 ID:', this.surveyId);
  }
  toggleAll(event: any) {
  const isChecked = event.target.checked;
  this.options.forEach(opt => opt.selected = isChecked);
}

  options = [
    { id: 'mrt', label: '捷運 (MRT)', selected: false },
    { id: 'bus', label: '公車 (Bus)', selected: false },
    { id: 'car', label: '自行開車', selected: false },
    { id: 'scooter', label: '騎機車', selected: false },
    { id: 'bike', label: '腳踏車', selected: false },
    { id: 'walk', label: '步行', selected: false }
  ];

  /**
   * 檢查是否至少勾選了一個選項
   * 用於 HTML 中 [disabled]="!isAnySelected()" 的判斷
   */
  isAnySelected(): boolean {
    return this.options.some(opt => opt.selected);
  }

  /**
   * 返回問卷列表頁面
   */
  goBack() {
    this.router.navigate(['/table-list']);
  }

  /**
   * 處理問卷送出
   */
  submit() {
    const selectedValues = this.options
      .filter(opt => opt.selected)
      .map(opt => opt.label);

    console.log('使用者選擇了：', selectedValues);

    // 提示使用者並跳轉
    alert('問卷已成功送出！');
    this.goBack();
  }
}
