import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { RoleEnum } from 'src/app/enums/role.enum';

declare function initializePlugin();
@Component({
  selector: 'app-sidebard',
  templateUrl: './sidebard.component.html',
  styleUrls: ['./sidebard.component.css']
})
export class SidebardComponent implements OnInit {

  toggled: boolean = false;
  logoSrc: string  = 'assets/img/pepepaganga_ico.png';

  adminItem= {
    title: 'Administración',
    icon: 'fas fa-user-lock',
    subtitle: 'Panel',
    divider: 'sidebar-divider',
    submenu: [
      { title: 'Usuarios', url: '/home/users-admin', roles: [RoleEnum.ADMIN] },
      { title: 'Vendedores', url: '/home/sellers' , roles: [RoleEnum.ADMIN]},
      { title: 'Márgenes', url: '/home/margins', roles: [RoleEnum.ADMIN, RoleEnum.SELLER] },
      { title: 'Marketplaces', url: '/home/list-marketplaces' , roles: [RoleEnum.ADMIN]},
      { title: 'Cuentas Mercado Libre', url: '/home/meli-accounts' , roles: [RoleEnum.ADMIN, RoleEnum.SELLER]},
      { title: 'Configuración del sistema', url: '/home/configuration' , roles: [RoleEnum.ADMIN]}
    ]
  }

  productItem=  {
    title: 'Mis productos',
    icon: 'fas fa-store',
    subtitle: 'Mis productos',
    divider: 'sidebar-divider',
    submenu: [
      { title: 'Mis productos', url: '/home/marketplaces' , roles: [RoleEnum.ADMIN, RoleEnum.SELLER]},
      { title: 'Productos Publicados', url: '/home/published-products', roles: [RoleEnum.ADMIN, RoleEnum.SELLER] }
    ]
  }

  constructor(public sidebarService: SidebarService ) {

  }

  ngOnInit(): void {
    initializePlugin();
  }




}
