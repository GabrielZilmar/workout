export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  delay = 500
) {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}
