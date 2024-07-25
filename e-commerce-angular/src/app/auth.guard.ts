import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./service/auth.service";


export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Array<string>;
  const userRoles = authService.getUserRolesFromToken();

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if(!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const hasRequiredRole  = requiredRoles.some(role => userRoles.includes(role));
  
  if (!hasRequiredRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
}
