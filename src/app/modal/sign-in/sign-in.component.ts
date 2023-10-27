import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, docData } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { doc } from 'firebase/firestore';
import { ROLE } from 'src/app/shared/guard/role.constant';
import { SignUpComponent } from '../sign-up/sign-up.component';

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
    private auth: Auth,
    private afs: Firestore,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SignInComponent>
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
    const userCredential = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    this.loginSubscription = docData(
      doc(this.afs, 'users', userCredential.user.uid)
    ).subscribe((user) => {
      this.user = user;
      const curentUser = { ...user, uid: userCredential.user.uid };
      localStorage.setItem('curentUser', JSON.stringify(curentUser));
      this.actuve();
    });
  }

  actuve(): void {
    if (this.user && this.user.role === ROLE.USER) {
      this.close();
      this.router.navigate(['/user']);
    } else if (this.user && this.user.role === ROLE.ADMIN) {
      localStorage.removeItem('basket');
      this.close();
      this.router.navigate(['/admin/']);
    }
  }

  sighUpMaoal(): void {
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
