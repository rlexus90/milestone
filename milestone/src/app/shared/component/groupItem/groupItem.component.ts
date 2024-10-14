import { Component, Input } from '@angular/core';
import { IOneGroup } from '../../models/serverData';

@Component({
  selector: 'app-groupItem',
  templateUrl: './groupItem.component.html',
  styleUrls: ['./groupItem.component.scss'],
})
export class GroupItemComponent {
  @Input() group!: IOneGroup;
  @Input() user!: string;
  @Input() callbackFn!: Function;
}
