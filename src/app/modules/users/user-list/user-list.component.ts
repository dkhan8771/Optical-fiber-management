import { Component } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  public products: any;
  public cols: any[];
  public visible: boolean = false;

  public firstName: any;
  public lastName: any;
  public age: any;
  public selectedRole: any;
  public userType: any;
  public about: any;
  public roles: any;

  constructor() {
    this.roles = [
      {
        role: 'User',
        roleId: 'type_User',
      },
      {
        role: 'Admin',
        roleId: 'type_Admin',
      },
    ];

    this.cols = [
      { field: 'code', header: 'Code' },
      { field: 'name', header: 'Name' },
      { field: 'category', header: 'Category' },
      { field: 'from', header: 'From' },
    ];

    this.products = [
      {
        code: '1',
        name: 'User 1',
        category: 'A',
        from: 'Bengalore A',
      },
      {
        code: '2',
        name: 'User 2',
        category: 'B',
        from: 'Bengalore B',
      },
      {
        code: '3',
        name: 'User 3',
        category: 'C',
        from: 'Bengalore C',
      },
      {
        code: '4',
        name: 'User 4',
        category: 'D',
        from: 'Bengalore D',
      },
      {
        code: '5',
        name: 'User 5',
        category: 'E',
        from: 'Bengalore E',
      },
    ];
  }

  showDialog() {
    this.visible = true;
  }
}
