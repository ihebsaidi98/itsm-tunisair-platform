import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {User} from 'models/user.model';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ToastrService} from "ngx-toastr";
import {Role} from "../../models/role.enum";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public currentUser: Observable<User>;
    private baseUrl = 'http://localhost:8080/api/v1/auth';
    //private
    private currentUserSubject: BehaviorSubject<User>;

    constructor(private http: HttpClient, private _toastrService: ToastrService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    // getter: currentUserValue
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    refreshSession(data: User) {
        if (data) {
            localStorage.setItem('currentUser', JSON.stringify(data));
            this.currentUserSubject.next(data);

            this._toastrService.success(
                'Your account has been updated',
                'Upadated successfully!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
            );
        } else {
            this._toastrService.error(
                'Failed to refresh session. Please log in again.',
                'Error',
                { toastClass: 'toast ngx-toastr', closeButton: true }
            );
            this.logout();
        }
    }


    /**
     *  Confirms if user is admin
     */
    get isAdmin() {
        return this.currentUser && this.currentUserSubject.value.role === Role.ADMIN;
    }

    /**
     *  Confirms if user is admin
     */
    get isManager() {
        return this.currentUser && this.currentUserSubject.value.role === Role.MANAGER;
    }

    /**
     *  Confirms if user is client
     */
    get isClient() {
        return this.currentUser && this.currentUserSubject.value.role === Role.WORKER;
    }
    get getId():number {
        return this.currentUserSubject.value.id;
    }

    addUser(formData: FormData): Observable<any> {
        return this.http.post<User>(this.baseUrl + '/register', formData
        ).pipe(catchError(this.handleError));
    }

    activateAccount(code: number): Observable<any> {
        return this.http.post<String>(this.baseUrl + `/activate-account/${code}`, code);
    }
    sendRecoveryMail(mail: string): Observable<any> {
        return this.http.post<String>(this.baseUrl + `/recover-account`, mail);
    }

    changePasswordAfterActivation(data: { code, password }): Observable<any> {
        return this.http.post<Boolean>(this.baseUrl + `/changepassword/${data?.code}`, data.password);
    }

    login(email: string, password: string) {
        return this.http
            .post<any>(`${this.baseUrl}/login`, {email, password})
            .pipe(
                map(user => {
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));

                        // Display welcome toast!
                        setTimeout(() => {
                            this._toastrService.success(
                                'You have successfully logged in as an ' +
                                user.role +
                                ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
                                '👋 Welcome, ' + user.firstname + '!',
                                {toastClass: 'toast ngx-toastr', closeButton: true}
                            );
                        }, 2500);

                        // notify
                        this.currentUserSubject.next(user);

                    }
                    if (user && user.message) {
                        if (user.message === "User not found") {
                            setTimeout(() => {
                                this._toastrService.error(
                                    'User not found',
                                    'Error !!',
                                    {toastClass: 'toast ngx-toastr', closeButton: true}
                                );
                            }, 2500);
                        }
                        if (user.message === "Account not activated") {
                            setTimeout(() => {
                                this._toastrService.error(
                                    'Account not activated ',
                                    'Error !',
                                    {toastClass: 'toast ngx-toastr', closeButton: true}
                                );
                            }, 2500);
                        }
                        if (user.message === "Invalid password") {
                            setTimeout(() => {
                                this._toastrService.error(
                                    'Invalid password',
                                    'Error ! ',
                                    {toastClass: 'toast ngx-toastr', closeButton: true}
                                );
                            }, 2500);
                        }
                    }

                    return user;
                })
            );
    }

    /**
     * User logout
     *
     */
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        // notify
        this.currentUserSubject.next(null);
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        // Optionally, log the error to an external service
        console.error(errorMessage);
        return throwError(errorMessage);
    }


}

