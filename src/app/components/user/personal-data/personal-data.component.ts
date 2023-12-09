import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CollectionReference, Firestore, doc, docData, getDocs, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { LocalStorageService } from 'src/app/shared/service/local-storage/local-storage.service';
import { collection, DocumentData } from '@firebase/firestore';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  deleteObject,
  getDownloadURL,
  percentage,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';


interface user {
  birthdate: Date,
  email: string,
  login: string,
  firstname: string,
  lastname: string,
  imageUser: string,
}

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss']
})
export class PersonalDataComponent {
  public editStatus = false
  public loginSubscription!: Subscription;
  public user: any = [];
  private uid!: string;
  public userForm!: FormGroup;
  public uploadPercent!: number;
  public newimage = false;
  public loadImage = true;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: Firestore,
    private localStorsge: LocalStorageService,
    private formBuilder: FormBuilder,
    private storsgeIcon: Storage,
  ) { };

  ngOnInit(): void {
    let user = this.localStorsge.getData('currentUser')
    this.uid = user.uid
    this.getOneUsers(this.uid);
    this.userFormInit();

  }


  userFormInit(): void {
    this.userForm = this.formBuilder.group({
      login: [null],
      firstname: [null],
      lastname: [null],
      imageUser: [null],
      birthdate: [null],
    });
  }



  getOneUsers(uid: string) {
    this.loginSubscription = docData(
      doc(this.afs, 'users', uid)
    ).subscribe((user) => {
      this.user = user;
      this.userForm.patchValue({
        login: this.user.login,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        imageUser: this.user.imageUser,
        birthdate: this.user.birthdate,
      })
      console.log(this.userForm.value);

    });
  }



  isFormChanged(): boolean {
    return this.userForm.dirty;
  }

  isFormImageChanged(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return control ? control.dirty : false;
  }


  // Завантаження зображення 
  async uploadUserImage(actionImage: any): Promise<void> {
    const file = actionImage.target.files[0];
    const previousImageURL = this.user.imageUser;

    if (previousImageURL.startsWith('https://firebasestorage.googleapis.com')) {
      const task = ref(this.storsgeIcon, previousImageURL);
      deleteObject(task).then(() => {
        this.uploadPercent = 0;
        this.userForm.patchValue({
          imageUser: null,
        });
      });
    }

    this.loadFIle('user-image', file.name, file)
      .then(async (data) => {
        const userDocRef = doc(this.afs, 'users', this.uid);
        await setDoc(userDocRef, { imageUser: data }, { merge: true });
        this.getOneUsers(this.uid);

      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Завантаження файлу в хмарне сховище
  async loadFIle(
    folder: string,
    name: string,
    file: File | null
  ): Promise<string> {
    const pathIcon = `${folder}/${name}`;
    let urlIcon = '';
    if (file) {
      try {
        const storageRef = ref(this.storsgeIcon, pathIcon);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe((data) => {
          this.uploadPercent = data.progress;
        });
        await task;
        urlIcon = await getDownloadURL(storageRef);
      } catch (e: any) {
        console.error(e);
      }
    } else {
      console.log('Wrong file');
    }
    return Promise.resolve(urlIcon);
  }


  editUserData() {
    const userDocRef = doc(this.afs, 'users', this.uid);

    // Отримати значення з форми
    const updatedUserData = this.userForm.value;

    // Оновити дані користувача в Firestore за допомогою методу update()
    updateDoc(userDocRef, updatedUserData)
      .then(() => {
        console.log('Дані користувача оновлено успішно');
      })
      .catch((error) => {
        console.error('Помилка під час оновлення даних користувача:', error);
      });
  }




}