import { Injectable } from '@angular/core';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { PdfCreatePage } from '../pdf-create/pdf-create.page';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { Market } from '@ionic-native/market/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { AdmobfreeService } from './admobfree.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  iamgeArry : any = [];
  allPdfData : any = [];
  scanningData : any = [];
  appMode : any = "ios"
  constructor(
    public mc: ModalController,
    public actionSheet: ActionSheetController,
    public lc: LoadingController,
    public tc: ToastController,
    public ac: AlertController,
    public imagePicker: ImagePicker,
    private camera: Camera,
    private market: Market,
    private socialSharing: SocialSharing,
    private file: File,
    private fileOpener: FileOpener,
    private clipboard: Clipboard,
    private admobFree: AdmobfreeService,
  ) { }

  // Get Downlaod PDF
  getPDFs(){
    this.file.listDir(this.file.externalRootDirectory, 'Image-To-PDF').then(res => {
      this.allPdfData = res
      console.log("res>>>>>>>>>>>"+JSON.stringify(res));
    },err =>{
      console.log("err>>>>>>>>>>>"+JSON.stringify(err));
    });
  }

  // Get image to gullery
  goPickGullery(){
    const options : ImagePickerOptions = {
      maximumImagesCount:30,
      outputType:1
    }
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        // this.iamgeArry.push((window as any).Ionic.WebView.convertFileSrc(results[i]))
        this.iamgeArry.push('data:image/jpeg;base64,' + results[i])
        console.log('Image URI:======== ' + results[i]);
      }
      // if(this.iamgeArry.length){
      //   this.goPdfCreate();
      //   console.log("iamgeArry>>>>>>>>",this.iamgeArry);
      // }else{
      //   console.log("iamgeArry111111>>>>>>>>",this.iamgeArry);
      // }
    }, (err) => { });
  }

  // Get image to camera
  pickToCamera(){
    const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options).then((imageData) => {
      this.iamgeArry.push('data:image/jpeg;base64,' + imageData)
		}, (err) => { });
  }
  // =========================

  // After Make PDF

  // PDF Create
  async goPdfCreate(value) {
    const modal = await this.mc.create({
      component: PdfCreatePage,
      cssClass: 'my-custom-class',
      componentProps:{isFor : value},
      swipeToClose: true,
      presentingElement: await this.mc.getTop() // Get the top-most ion-modal
    });
    return await modal.present();
  }

  // PDF View
  viewPdf(filepath){
    this.fileOpener.open(filepath, 'application/pdf').then(() => {
      console.log('File is opened')
    }).catch(e => console.log('Error opening file', e));
  }

  // PDF Delete
  deletePdf(filepath, fileName, index){
    console.log("filepath>>>>>"+filepath);
    console.log("fileName>>>>>"+fileName);
    let filePath = this.file.externalRootDirectory +'Image-To-PDF'
    this.file.removeFile(filePath , fileName).then((res)=>{
      console.log("resres>>>>>>>>"+res);
      this.allPdfData.splice(index,1);
    },err =>{
      console.log("errerr>>>>>>>>"+JSON.parse(err));
    })
  }

  // PDF Share
  pdfShare(filepath){
    this.socialSharing.share("", "", filepath).then((entries) => {
      this.admobFree.showRewardVideo();
      console.log('success>>>>>>>>>>' + JSON.stringify(entries));
    }).catch((error) => {
      alert('error>>>>>>>>>>' + JSON.stringify(error));
    });
  }

  // BottomSheet
  async viewActionSheet(filepath, fileName, index) {
    const actionSheet = await this.actionSheet.create({
      header: fileName,
      cssClass: 'my-custom-class',
      // mode:this.appMode,
      buttons: [
        {
          cssClass: 'custom_color',
          text: 'View',
          icon: 'eye-outline',
          handler: () => {
            this.viewPdf(filepath);
          }
        },
        // {
        //   cssClass: 'custom_color',
        //   text: 'Rename',
        //   icon: 'brush-outline',
        //   handler: () => {}
        // },
        {
          cssClass: 'custom_color',
          text: 'Share',
          icon: 'share-social-outline',
          handler: () => {
            this.pdfShare(filepath);
          }
        },{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash-outline',
        cssClass: 'custom_color',
        handler: () => {
          this.deleteConfirm(filepath, fileName, index);
        }
      },{
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {}
      }]
    });
    await actionSheet.present();
  }

  async deleteConfirm(filepath, fileName, index) {
    const alert = await this.ac.create({
      header: 'Confirm Delete !!!',
      message: 'Are you sure you want to delete parminatally ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.deletePdf(filepath, fileName, index);
            this.admobFree.showInterstitialAds();
            console.log('Confirm Okay');
          }
        }
      ]
    });
  
    await alert.present();
  }

  // Scanning Result
  async scanningResultAlert(data) {
    const alert = await this.ac.create({
      header: 'Scanning Result',
      mode:"ios",
      message: data,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // this.admobFree.showRewardVideo();
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Copy',
          handler: () => {
            this.copyText(data);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  copyText(value){
    this.clipboard.copy(value);
    this.presentToast('Text Copied');
    this.admobFree.showInterstitialAds();
  }

  // Toaster
  async presentToast(massege) {
    const toast = await this.tc.create({
      message: massege,
      duration: 5000
    });
    toast.present();
  }

  // Open Loading
  async presentLoading(message) {
    const loading = await this.lc.create({
      message: message,
    });
    await loading.present();
  }

  // Dismiss Loading
  loadDismiss(){
    this.lc.dismiss();
  }

  // Share App
  shareApp(){
    this.socialSharing.share(
      'Image To PDF - Make PDF Downlaod, Share and Give 5 Stare Review Thank you :',
      'Thank you',
      'https://play-lh.googleusercontent.com/dUJmZnlPvz7eC3vNwivgHD9WDtTVhwyUBzLkVv5WP3LFwMfA45ieFBINgCTpHztkHGXh=s360-rw',
      'https://play.google.com/store/apps/details?id=com.lifetechs.imagetopdf'
      ).then((res) => {
      // Success!
    }).catch((error) => {
      // Error!
    })
  }

  // Rate App
  rateApp(){
    this.market.open('com.lifetechs.imagetopdf');
  }
  
}
