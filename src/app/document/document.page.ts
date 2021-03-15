import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
// import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-document',
  templateUrl: './document.page.html',
  styleUrls: ['./document.page.scss'],
})
export class DocumentPage implements OnInit {

  constructor(
    public gs: GlobalService,
    // private fileOpener: FileOpener
  ) { }

  ngOnInit() {
  }

  // viewPdf(filepath){
  //   this.fileOpener.open(filepath, 'application/pdf')
  //   .then(() => console.log('File is opened'))
  //   .catch(e => console.log('Error opening file', e));
  // }

}
