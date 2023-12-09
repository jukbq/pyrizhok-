import { Component } from "@angular/core";
import { Auth, FacebookAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { collection, docData, getDocs, query, where } from '@angular/fire/firestore';
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SignInComponent } from "../sign-in/sign-in.component";
import { LocalStorageService } from "src/app/shared/service/local-storage/local-storage.service";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  public sighUoForn!: FormGroup;
  public user: any;
  public errorPass = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: Auth,
    private router: Router,
    private afs: Firestore,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SignUpComponent>,
    private localStorsge: LocalStorageService,
    public afAuth: AngularFireAuth

  ) { }

  ngOnInit(): void {
    this.logFormInit();
  }

  logFormInit(): void {
    this.sighUoForn = this.formBuilder.group({
      login: [null],
      firstname: [null],
      lastname: [null],
      imageUser: [null],
      birthdate: [null],
      email: [null, [Validators.required, Validators.email]],
      role: [null],
      password: [null, [Validators.required]],
      password2: [null, [Validators.required]],
      uid: [null]
    });
  }


  userRegister() {
    const pass = this.sighUoForn.value.password;
    const pass2 = this.sighUoForn.value.password2;
    if (pass !== pass2) {
      this.errorPass = true;
      console.log('Введені паролі не співпадають');
    } else {
      const { email, password } = this.sighUoForn.value;
      this.emailSighUp(email, password)
        .then(() => {
          this.active();
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Виникла помилка! ",
            text: "Корситувача з такою адресою вже зареєстрован!",
          });
        });
    }

  }

  async emailSighUp(email: string, password: string): Promise<any> {
    const userReg = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    const user = {
      login: this.sighUoForn.value.firstname,
      email: userReg.user.email,
      password: password,
      firstName: this.sighUoForn.value.firstname,
      lastName: this.sighUoForn.value.lastname,
      birthdate: this.sighUoForn.value.birthdate,
      role: 'USER',
      uid: userReg.user.uid
    };
    await setDoc(doc(this.afs, 'users', userReg.user.uid), user);
    this.localStorsge.saveData('curentUser', user);

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
              this.active();
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
            this.active();
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
              this.active();
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
            this.active();
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
          text: "Ви не авторизовані через Facebook!",
        });

      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Виникла помилка! ",
        text: "Помилка під час входу через Facebook!",
      });
    }
  }
  active(): void {
    this.close();
    window.location.href = '/user';
  }

  close(): void {
    this.dialogRef.close();
  }

  sighInMaoal(): void {
    this.close();
    this.dialog.open(SignInComponent, {
      panelClass: 'sigh_maoa_dialog',
    });
  }


}
