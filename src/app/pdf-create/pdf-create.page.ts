import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController,NavParams } from '@ionic/angular';
import { RotationPage } from '../rotation/rotation.page';
import { GlobalService } from '../services/global.service';
import { FileTransfer,FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx'; // FileUploadOptions, FileTransferObject
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AdmobfreeService } from '../services/admobfree.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-pdf-create',
  templateUrl: './pdf-create.page.html',
  styleUrls: ['./pdf-create.page.scss'],
})
export class PdfCreatePage implements OnInit {
  newFileName: any = "my pdf";
  constructor(
    public gs: GlobalService,
    public admobFree: AdmobfreeService,
    public modalCtrl: ModalController,
    public altrc: AlertController,
    public router: Router,
    private transfer: FileTransfer,
    private socialsharing: SocialSharing,
    private file: File,
    public camera: Camera,
    public navparams: NavParams,
  ) {
    console.log("isFor>>>>>>>>>>"+navparams.data.isFor);
    // this.gs.goPickGullery();
  }

  ngOnInit() {
  }

  deleteAll(index){
    this.gs.iamgeArry.splice(index, 1);
  }

  async rotationModal() {
    const modal = await this.modalCtrl.create({
      component: RotationPage,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      presentingElement: await this.modalCtrl.getTop() // Get the top-most ion-modal
    });
    return await modal.present();
  }

  async pdfName() {
    this.newFileName = new Date().getTime();
    const alert = await this.altrc.create({
      header: 'PDF Name',
      // message: 'Message <strong>text</strong>!!!',
      mode:'ios',
      backdropDismiss:false,
      inputs: [
        {
          name: 'value',
          value: this.newFileName,
          type: 'text',
          placeholder: 'Enter PDF Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: (res) => {
            this.newFileName = String(res.value) || String(this.newFileName);
            this.createPDF();
          }
        }
      ]
    });
  
    await alert.present();
  }

  // Create PDF
  createPDF() {
    this.admobFree.showInterstitialAds();
    this.gs.presentLoading('Saving...');
    pdfmake.vfs = pdfFonts.pdfMake.vfs;
    let colams = [];
    for(let i in this.gs.iamgeArry){
      colams.push({
        image : this.gs.iamgeArry[i],
        pageBreak: this.gs.iamgeArry.lenght > i+1 ? 'after' : '',
        maxWidth: 575,
        maxHeight: 820,
        alignment: "center"
      })
    }
    var dd = {
      content: colams,
      pageSize: 'A4',
      pageMargins: [ 10, 10, 10, 10 ],
    };
    // const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    // pdfmake.createPdf(dd).open();

    // return

    pdfmake.createPdf(dd).getBuffer((buffer) => {
      var blob = new Blob([buffer], { type: 'application/pdf' });
      this.file.writeFile(this.file.externalDataDirectory, this.newFileName+'.pdf', blob, { replace: true }).then(fileEntry => {
        const fileTransfer: FileTransferObject = this.transfer.create();
        const url = this.file.externalDataDirectory + this.newFileName+'.pdf'
        let filePath = this.file.externalRootDirectory +'Image-To-PDF/'+this.newFileName+'.pdf'
        console.log(JSON.stringify("filePath>>>>>>>>>>>>>"+filePath));
        fileTransfer.download(url, filePath).then((entry) => {
          this.gs.getPDFs();
          setTimeout(() => {
            this.gs.loadDismiss();
            this.router.navigate(['/tabs/document'])
            this.modalCtrl.dismiss();
            this.gs.iamgeArry = [];
            this.gs.presentToast("PDF Saved Successfully!");
          }, 1000);
          console.log('download complete :' + entry.toURL());
        }, (error) => {
          console.log("error>>>>>>>>>>>>>"+JSON.stringify(error));
          // handle error
        });
      });
    },err =>{
      console.log("errerrerrerr");
    });
  }
  
  // toGallary(){
  //   const options: CameraOptions = {
	// 		quality: 100,
	// 		sourceType: this.camera.PictureSourceType.PHOTOLIBRARY, //PHOTOLIBRARY
	// 		destinationType: this.camera.DestinationType.FILE_URI,
	// 		encodingType: this.camera.EncodingType.JPEG,
	// 		mediaType: this.camera.MediaType.PICTURE,
	// 	}
	// 	this.camera.getPicture(options).then((imageData) => {
  //     this.gs.iamgeArry.push((window as any).Ionic.WebView.convertFileSrc(imageData));
	// 	}, (err) => { });
  // }

  changePhoto(index) {
		const options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY, //PHOTOLIBRARY
		}

		this.camera.getPicture(options).then((imageData) => {
      // this.iamgeArry.push('data:image/jpeg;base64,' + imageData)
      this.gs.iamgeArry[index] = 'data:image/jpeg;base64,' + imageData;
		}, (err) => { });
	}

}
