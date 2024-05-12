import { Injectable } from "@angular/core";

export interface SideNavigationItem {
  label: string;
  icon: string;
  url?: string;
  routerLink?: string;
  items?: SideNavigation[];
}

export interface SideNavigation extends SideNavigationItem {
  children?: SideNavigationItem[];
}

const SideNavigationItems = [
  {
    label: 'Dashboard',
    icon: 'pi pi-align-left',
    routerLink: 'dashboard'
  },
  {
    label: 'Users',
    icon: 'pi pi-users',
    routerLink: 'users'
  },
  {
    label: 'Map',
    icon: 'pi pi-fw pi-map',
    routerLink: 'map'
  },
  {
    label: 'sub 1',
    icon: 'pi pi-fw pi-pencil',
    items: [
      {
        label: 'content 3',
        icon: 'pi pi-fw pi-align-left'
      },
      {
        label: 'content 3',
        icon: 'pi pi-fw pi-align-center'
      }
    ]
  },
  {
    label: 'Sub 2',
    icon: 'pi pi-fw pi-user',
    items: [
      {
        label: 'content',
        icon: 'pi pi-fw pi-user-plus'
      },
      {
        label: 'sub-A',
        icon: 'pi pi-fw pi-users',
        items: [
          {
            label: 'sub-B',
            icon: 'pi pi-fw pi-filter',
            items: [
              {
                label: 'sub-AB',
                icon: 'pi pi-fw pi-print'
              }
            ]
          },
          {
            label: 'sub3',
            icon: 'pi pi-fw pi-bars'
          }
        ]
      }
    ]
  },
  {
    label: 'Events',
    icon: 'pi pi-fw pi-calendar'
  }
];

@Injectable()
export class SideNavigationItem {
  public get() {
    return SideNavigationItems;
  }
}
