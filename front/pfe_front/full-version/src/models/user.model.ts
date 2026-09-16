import {Role} from "./role.enum";

export class User {
  id!: number;
  firstname!: string;
  lastname!: string;
  email!: string;
  password!: string;
  enabled!: Boolean;
  accountLocked!: Boolean;
  role:Role

}
