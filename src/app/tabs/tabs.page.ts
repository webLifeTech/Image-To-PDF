import { Component } from '@angular/core';
import { AdmobfreeService } from '../services/admobfree.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public admobFree : AdmobfreeService
  ) {}

}
