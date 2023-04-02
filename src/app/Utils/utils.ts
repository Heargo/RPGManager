export function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message
    return String(error)
  }
  
export function scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
}