import { CoreMenu } from '@core/types';

//? DOC: http://localhost:7777/demo/vuexy-angular-admin-dashboard-template/documentation/guide/development/navigation-menus.html#interface

export const menu: CoreMenu[] = [

  {
    id: 'apps',
    type: 'section',
    title: 'Apps & Pages',
    translate: 'MENU.APPS.SECTION',
    icon: 'package',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        translate: 'MENU.APPS.DASHBOARD',
        type: 'item',
        icon: 'home',
        role: ['ADMIN','MANAGER'],
        url: 'dashboard'
      }, {
        id: 'incident',
        title: 'Incident',
        translate: 'MENU.APPS.INCIDENT',
        type: 'item',
        icon: 'octagon',
        role: ['ADMIN'],
        url: 'incident/admin'
      },{
        id: 'incident',
        title: 'Incident',
        translate: 'MENU.APPS.INCIDENT',
        type: 'item',
        icon: 'octagon',
        role: ['MANAGER'],
        url: 'incident/manager'
      },{
        id: 'incident',
        title: 'Incident',
        translate: 'MENU.APPS.INCIDENT',
        type: 'item',
        icon: 'octagon',
        role: ['WORKER'],
        url: 'incident/worker'
      },
      {
        id: 'probleme',
        title: 'Probléme',
        translate: 'MENU.APPS.PROBLEME',
        type: 'item',
        role: ['ADMIN'],
        icon: 'alert-triangle',
        url: 'probleme/admin'
      },{
        id: 'probleme',
        title: 'Probléme',
        translate: 'MENU.APPS.PROBLEME',
        type: 'item',
        role: ['MANAGER'],
        icon: 'alert-triangle',
        url: 'probleme/manager'
      },{
        id: 'probleme',
        title: 'Probléme',
        translate: 'MENU.APPS.PROBLEME',
        type: 'item',
        role: ['WORKER'],
        icon: 'alert-triangle',
        url: 'probleme/worker'
      },
      {
        id: 'changement',
        title: 'Change',
        translate: 'MENU.APPS.CHANGEMENT',
        type: 'item',
        icon: 'package',
        role: ['ADMIN'],
        url: 'changement/admin'
      },
      {
        id: 'changement',
        title: 'Change',
        translate: 'MENU.APPS.CHANGEMENT',
        type: 'item',
        icon: 'package',
        role: ['MANAGER'],
        url: 'changement/manager'
      },
      {
        id: 'changement',
        title: 'Change',
        translate: 'MENU.APPS.CHANGEMENT',
        type: 'item',
        icon: 'package',
        role: ['WORKER'],
        url: 'changement/worker'
      },
      {
        id: 'users',
        title: 'Users',
        translate: 'MENU.APPS.USERS',
        type: 'item',
        icon: 'users',
        role: ['ADMIN'],
        url: 'user/admin'
      }
      ]
  }
];
