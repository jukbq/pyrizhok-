import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { collection, docData, getDocs, query, where } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ROLE } from 'src/app/shared/guard/role.constant';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { LocalStorageService } from 'src/app/shared/service/local-storage/local-storage.service';
import { FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
import Swal from 'sweetalert2';
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  public loginForm!: FormGroup;
  public user: any;
  public loginSubscription!: Subscription;
  public isEntering: boolean = true;
  public isLeaving: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private afs: Firestore,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SignInComponent>,
    private localStorsge: LocalStorageService,
    public afAuth: AngularFireAuth
  ) { }
  ngOnInit(): void {
    this.logFormInit();
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  logFormInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  loginUser(): void {
    const { email, password } = this.loginForm.value;
    this.login(email, password)
      .then(() => {
        console.log('Користувач успішно автроризувався');
      })
      .catch((e) => {
        console.log('Невірний email або пароль');
      });
  }



  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log(userCredential);

      /*    this.loginSubscription = docData(
        doc(this.afs, 'users', userCredential.user.uid)
      ).subscribe((user) => {
        this.user = user;
        const curentUser = { ...user, uid: userCredential.user.uid };
        localStorage.setItem('curentUser', JSON.stringify(curentUser));
        this.actuve();
      }); */
    } catch (error) {
      console.error('Помилка аутентифікації через пошту та пароль:', error);
      // Обробка помилок аутентифікації (виведення помилки або інші дії в разі невдачі)
    }
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await this.afAuth.signInWithPopup(provider);
      if (userCredential && userCredential.user) {
        const userEmail = userCredential.user.email;

        if (userEmail) {
          const userRef = collection(this.afs, 'users');
          const querySnapshot = await getDocs(query(userRef, where('email', '==', userEmail)));


          if (!querySnapshot.empty) {
            // Користувач з вказаним емейлом знайдений
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              this.user = userData;
              console.log(userData);

              const currentUser = { ...userData, uid: doc.id };
              this.localStorsge.saveData('currentUser', currentUser);
              this.actuve();
            });
          } else {
            const uid = userCredential.user.uid; // Отримати UID з аутентифікації
            const userName = userCredential.user.displayName;
            const nameParts = userName!.split(' ');
            const newUser = {
              login: nameParts[0], // Встановлення логіну з імені
              email: userEmail,
              firstname: nameParts[0],
              lastname: nameParts.slice(1).join(' '),
              imageUser: userCredential.user.photoURL,
              birthdate: new Date(),
              role: 'USER',
              uid: uid,
            };

            console.log(newUser);
            // Збереження нового користувача в базі даних
            await setDoc(doc(this.afs, 'users', uid), newUser);
            this.user = newUser;
            console.log(this.user);
            this.localStorsge.saveData('currentUser', newUser);
            this.actuve();
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Виникла помилка! ",
            text: "Ваш емайл не доступний!",
          });

        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Виникла помилка! ",
          text: "Ви не авторизовані через Google!",
        });

      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Виникла помилка! ",
        text: "Помилка під час входу через Google!",
      });

    }
  }


  async signInWithFacebook(): Promise<void> {
    try {
      const provider = new FacebookAuthProvider();
      const userCredential = await this.afAuth.signInWithPopup(provider);

      if (userCredential && userCredential.user) {
        const userEmail = userCredential.user.email;

        if (userEmail) {
          const userRef = collection(this.afs, 'users');
          const querySnapshot = await getDocs(query(userRef, where('email', '==', userEmail)));

          if (!querySnapshot.empty) {
            // Користувач з вказаним емейлом знайдений
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              this.user = userData;
              const currentUser = { ...userData, uid: doc.id };
              this.localStorsge.saveData('currentUser', currentUser);
              this.actuve();
            });
          } else {
            const uid = userCredential.user.uid; // Отримати UID з аутентифікації

            // Створення об'єкту нового користувача
            const userName = userCredential.user.displayName;
            const nameParts = userName!.split(' ');
            const newUser = {
              uid: uid,
              login: nameParts[0],
              email: userEmail,
              firstname: nameParts[0],
              lastname: nameParts.slice(1).join(' '),
              imageUser: userCredential.user.photoURL,
              birthdate: new Date(),
              role: 'USER',
            };

            // Збереження нового користувача в базі даних
            await setDoc(doc(this.afs, 'users', uid), newUser);

            // Створення користувача у системі аутентифікації Firebase з тим же UID
            await this.afAuth.createUserWithEmailAndPassword(userEmail, 'randomPassword');

            this.localStorsge.saveData('currentUser', newUser);
            this.actuve();
          }
        } else {
          // Обробка помилки, якщо емейл користувача не доступний
        }
      } else {
        // Обробка помилки, якщо користувач не авторизований через Facebook
      }
    } catch (error) {
      // Обробка помилки під час входу через Facebook
    }
  }



  actuve(): void {
    if (this.user && this.user.role === ROLE.USER) {
      this.close();
      this.router.navigate(['/user']);
    } else if (this.user && this.user.role === ROLE.ADMIN) {
      this.close();
      this.router.navigate(['/admin/']);
    }
  }

  sighUpMaoal(): void {
    console.log('11111');

    this.close();
    let sighUp = this.dialog.open(SignUpComponent, {
      panelClass: 'sigh_modal_dialog',
    });

  }

  shouldShowError(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return (control?.invalid && (control.dirty || control.touched)) || false;
  }



  close(): void {
    this.dialogRef.close();
  }
}
