import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { customEmailValidator } from '../validators/email.validator';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent {
  addUserForm: FormGroup;
  showModal = false;  

  constructor(private fb: FormBuilder, private router: Router) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, customEmailValidator()]],
      role: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.addUserForm.valid) {
      const userData = this.addUserForm.value;
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      users.push(userData); 
      localStorage.setItem('users', JSON.stringify(users));  

      this.showModal = true;  
    }
  }

  onCancel(): void {
    this.addUserForm.reset();
  }

  addAnotherUser(): void {
    this.showModal = false;  
    this.addUserForm.reset();  
  }

  goToUserList(): void {
    this.router.navigate(['/user-list']);  
  }
}
