import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { IonRouterOutlet, ModalController, Platform } from '@ionic/angular';
import { AdmobfreeService } from '../services/admobfree.service';
import { Tab3Page } from '../tab3/tab3.page';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  iamgeArry : any = [];
  constructor(
    // public imagePicker: ImagePicker,
    // private mc: ModalController,
    // public camera: Camera,
    public admobFree: AdmobfreeService,
    private platform: Platform,
    public gs: GlobalService,
    public barcode: BarcodeScanner,
    public mc: ModalController
  ) { }

  ngOnInit() {
  }

  async qrCodePage() {
    const modal = await this.mc.create({
      component: Tab3Page,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      // presentingElement: await this.mc.getTop() // Get the top-most ion-modal
    });
    return await modal.present();
  }
  goQRorBarCode(label){
    this.admobFree.rendomAdShow();
    this.qrCodePage();
    setTimeout(() => {
      let options : BarcodeScannerOptions = {
        prompt : label,
        showFlipCameraButton: true,
        showTorchButton: true,
        disableAnimations: true,
        disableSuccessBeep: true,
      }
      this.barcode.scan(options).then(barcodeData => {
        console.log('Barcodedata<<<<<<<<<<<'+ JSON.stringify(barcodeData));
        this.gs.scanningData.push(barcodeData);
        localStorage.setItem('scanData', JSON.stringify(this.gs.scanningData));
        this.mc.dismiss();
        if(barcodeData.text != ""){
          setTimeout(() => {
            this.gs.scanningResultAlert(barcodeData.text);
          }, 200);
        }
       }).catch(err => {
           console.log('Error', err);
       });
    }, 300);
  }

}
