import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user():User{
    return this.utilsSvc.getFromLocalStorage('user');
  }


  public appPages = [
    { title: 'Registo CHO', url: '/main/conteo-cho', icon: 'restaurant-outline' },
    { title: 'Reportes', url: '/main/report', icon: 'document-outline' },
    { title: 'Perfil', url: '/main/profile', icon: 'person-outline' }
  ];
  constructor() { }

  router = inject(Router);
  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event:any) =>{
      if(event?.url) this.currentPath = event.url;
    })
  }

  signOut() {
    this.firebaseSvc.signOut();
  }


}
