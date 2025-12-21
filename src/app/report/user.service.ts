import { Injectable, signal } from '@angular/core';

export interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private _users = signal<User[]>([]);

  users = this._users.asReadonly();

  loadUsers(data: User[]) {
    this._users.set(data);
  }

  toggleActive(id: number) {
    this._users.update(list =>
      list.map(u => u.id === id ? { ...u, active: !u.active } : u)
    );
  }
}
