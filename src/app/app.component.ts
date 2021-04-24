import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, IonRouterOutlet, Platform } from '@ionic/angular';
import { AdmobfreeService } from './services/admobfree.service';
import { File } from '@ionic-native/file/ngx';
import { GlobalService } from './services/global.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
declare var window : any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  fireBaseUrl:any;

  constructor(
    private platform: Platform,
    private router: Router,
    public admobFree : AdmobfreeService,
    public gs : GlobalService,
    private file: File,
    public ac : ActionSheetController,
    public av : AppVersion,
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
      try {
        window.cordova.plugins.firebase.config.fetch(1).then((isfetch: any) => {
          window.cordova.plugins.firebase.config.fetchAndActivate().then((res: any) => {
            window.cordova.plugins.firebase.config.getString('getAllurls').then((res2: any) => {
              this.fireBaseUrl = JSON.parse(res2);
              // console.log("this.fireBaseUrl>>>>>>>>>>>>>>>>>>>>>>>>>>>"+JSON.stringify(this.fireBaseUrl))
              this.av.getVersionNumber().then( crVersion =>{
                if(crVersion != this.fireBaseUrl['appVersion']){
                  this.appUpdate();
                }
              })
            }).catch((error: any) => console.error(error));
          });
        }).catch((err) => {
          console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' + err);
        });
      } catch (ex) {
        console.log('exexexexexexexexexexexexexexexex++++++++++++' + ex);
      }
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
      }, 300);
      this.admobFree.adMobFreeBanner();
    });
  }

  async appUpdate() {
    const actionSheet = await this.ac.create({
      header: 'Anjoy New Version',
      mode: 'ios',
      buttons: [{
        text: 'Update Now',
        handler: () => {
          this.gs.rateApp();
        }
      }, {
        text: 'New v'+this.fireBaseUrl['appVersion'],
        handler: () => {
          this.gs.rateApp();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
  
    await actionSheet.present();
  }
}
