import { Component, Input } from '@angular/core';
import { IMessages } from '../../models/messages';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() message!: IMessages;
}
