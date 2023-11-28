import { Component } from "@angular/core";
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";
import { Firestore, doc, setDoc } from "@angular/fire/firestore";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { SignInComponent } from "../sign-in/sign-in.component";
import { LocalStorageService } from "src/app/shared/service/local-storage/local-storage.service";


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
    private localStorsge: LocalStorageService

  ) { }

  ngOnInit(): void {
    this.logFormInit();
  }

  logFormInit(): void {
    this.sighUoForn = this.formBuilder.group({
      firstname: [null],
      lastname: [null],
      birthdate: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      password2: [null, [Validators.required]],
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
          console.log('Користувача успішно зареэстровано');
          this.active();
        })
        .catch((e) => {
          console.log('Корситувача з такою адресою вже зареєстровано');
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
      address: [],
      email: userReg.user.email,
      password: password,
      firstName: this.sighUoForn.value.firstname,
      lastName: this.sighUoForn.value.lastname,
      birthdate: this.sighUoForn.value.birthdate,
      role: 'USER',
    };
    await setDoc(doc(this.afs, 'users', userReg.user.uid), user);
    this.localStorsge.saveData('curentUser', user);

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
