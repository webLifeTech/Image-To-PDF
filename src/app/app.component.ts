import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { AdmobfreeService } from './services/admobfree.service';
import { File } from '@ionic-native/file/ngx';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  constructor(
    private platform: Platform,
    private router: Router,
    public admobFree : AdmobfreeService,
    public gs : GlobalService,
    private file: File,
  ) {
    this.initializeApp();
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url) {
        navigator['app'].exitApp();
      }
    });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.file.createDir(this.file.externalRootDirectory, 'Image-To-PDF', true).then(response => {
				console.log('Directory create'+response);
			}).catch(err => {
				console.log('Directory no create'+JSON.stringify(err));
			}); 

      setTimeout(() => {
        this.gs.getPDFs();
      }, 200);

      setTimeout(() => {
        this.admobFree.showInterstitialAds();
      }, 30000);
      this.admobFree.adMobFreeBanner();
    });
  }
}
