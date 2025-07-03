import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  constructor() { }

  ngOnInit() {
  }

  async takeImage() {
    let user = this.user();
    const dataUrl = ((await this.utilsSvc.takePicture('Imagen de Perfil')).dataUrl)
    const loading = await this.utilsSvc.loading();
    await loading.present();
    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    let path = `users/${user.uid}`;



    this.firebaseSvc.updateDocument(path, { image: user.image }).then(async res => {
      this.utilsSvc.saveInLovalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Imagen actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss();
    })
  }

}
