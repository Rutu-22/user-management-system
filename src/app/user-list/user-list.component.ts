import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['serialNo', 'name', 'email', 'role', 'actions'];
  users: User[] = [];
  filteredUsers: User[] = [];
  searchControl: FormControl = new FormControl('');

  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  editForm!: FormGroup; // <-- Initialize the form group
  selectedUser: User | null = null;
  isEditModalOpen: boolean = false;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadUsers();
    this.setupSearch();
    this.initializeForm(); // <-- Ensure form initialization
  }

  // Initialize the form when the component is loaded
  initializeForm(): void {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }

  loadUsers(): void {
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.filteredUsers = this.users;
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
  }

  setupSearch(): void {
    this.searchControl.valueChanges.subscribe((value: any) => {
      this.applyFilter(value);
    });
  }

  applyFilter(searchText: string): void {
    if (!searchText) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }
  }

  // Open the edit modal and pre-fill the form with user data
  onEdit(user: User): void {
    this.selectedUser = user;
    this.isEditModalOpen = true;

    // Make sure the form is initialized before setting the values
    if (this.editForm) {
      this.editForm.patchValue({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }

  closeModal(): void {
    this.isEditModalOpen = false;
    this.selectedUser = null;
  }

  // Update user data and save changes
  onUpdate(): void {
    if (this.editForm.valid) {
      const updatedUser = this.editForm.value;
      const userIndex = this.users.findIndex(
        (user) => user.email === this.selectedUser?.email
      );
      if (userIndex !== -1) {
        this.users[userIndex] = updatedUser; // Update the user data
        localStorage.setItem('users', JSON.stringify(this.users)); // Save updated users
        this.closeModal(); // Close the modal after update
      }
    }
  }

  addUser(): void {
    // Navigate to the "Add User" page
    this.router.navigate(['/add-user']);
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete ${user.name}?`)) {
      this.users = this.users.filter((u) => u !== user);
      localStorage.setItem('users', JSON.stringify(this.users)); // Save updated users
      this.loadUsers(); // Refresh user list
    }
  }

  goToUserList(): void {
    // Navigate to the User List page
    this.router.navigate(['/user-list']);
  }

  changePage(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }
}
