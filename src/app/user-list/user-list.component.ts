import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
  editForm!: FormGroup;
  selectedUser: User | null = null;
  isEditModalOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
    this.setupSearch();
  }

  loadUsers(): void {
    // Get users from localStorage (if available)
    this.users = JSON.parse(localStorage.getItem('users') || '[]');
    this.filteredUsers = this.users;
    this.totalPages = Math.ceil(this.users.length / this.pageSize);
  }

  setupSearch(): void {
    this.searchControl.valueChanges.subscribe((value) => {
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
  
  onEdit(user: User): void {
    this.selectedUser = user;
    this.isEditModalOpen = true;

    if (this.editForm) {
      this.editForm.setValue({
        name: user.name,
        email: user.email,
        role: user.role,
      });
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
