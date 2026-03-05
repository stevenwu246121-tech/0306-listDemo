import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// 定義資料介面，增強型別安全
export interface DialogData {
  type: 'result' | 'message'; // 區分模式
  title: string; // 標題 (例如：問卷結果 或 系統提示)
  message?: string; // 用於 message 模式
  surveyResults?: {
    // 用於 result 模式
    questionTitle: string;
    selectedOptions: string[];
  }[];
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
