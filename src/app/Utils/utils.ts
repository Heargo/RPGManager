import { FormGroup } from "@angular/forms";

export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
  }
  
export function scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
}

export function passwordMatchValidator(g: FormGroup) {
  return g.get('password')?.value === g.get('passwordConfirm')?.value
     ? null : {'mismatch': true};
}

export function hasPermission(permissions: string[], id: string) {
  let hasPermission = false;

  permissions.forEach((permission) => {
    if (permission.includes(id)) {
      hasPermission = true;
    }
  });
  
  return hasPermission;
}