import { Injectable } from "@angular/core";

export interface TopNavigationItem {
  label: string;
  icon: string;
  url?: string;
  items?: TopNavigation[];
}

export interface TopNavigation extends TopNavigationItem {
  items?: TopNavigationItem[];
}

const TopNavigationItems = [
  {
    label: 'Item 1',
    icon: 'pi pi-fw pi-file',
    items: [
      {
        label: 'Sub Item 1',
        icon: 'pi pi-fw pi-plus',
        items: [{
          label: 'Sub Item 2',
          icon: 'pi pi-fw pi-plus'
        },
        {
          label: 'Sub Item 2',
          icon: 'pi pi-fw pi-trash'
        }]
      },
      {
        label: 'Sub Item 1',
        icon: 'pi pi-fw pi-trash'
      }
    ]
  },
  {
    label: 'Item 2',
    icon: 'pi pi-fw pi-file'
  }
];

@Injectable()
export class TopNavigationItem {
  public get() {
    return TopNavigationItems;
  }
}
