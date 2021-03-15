import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { IonReorderGroup, ModalController } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/core';

@Component({
  selector: 'app-rotation',
  templateUrl: './rotation.page.html',
  styleUrls: ['./rotation.page.scss'],
})
export class RotationPage implements OnInit {
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  position : any;
  constructor(
    public gs: GlobalService,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
    this.position = ev.detail.to
    ev.detail.complete();
  }
  toggleReorderGroup() {
    this.reorderGroup.disabled = !this.reorderGroup.disabled;
  }

}
