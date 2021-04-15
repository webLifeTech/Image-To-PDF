import { Component } from '@angular/core';
import { AdmobfreeService } from '../services/admobfree.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public admobFree : AdmobfreeService,
    public gs : GlobalService
  ) {}

}
