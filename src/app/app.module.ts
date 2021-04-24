import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Market } from '@ionic-native/market/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    ImagePicker,
    Camera,
    File,
    FileTransfer,
    FileOpener,
    SocialSharing,
    AdMobFree,
    Market,
    BarcodeScanner,
    Clipboard,
    AppVersion,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
