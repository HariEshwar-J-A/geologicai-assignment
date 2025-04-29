import '@testing-library/jest-dom';

if (!window.URL.createObjectURL) {
  Object.defineProperty(window.URL, 'createObjectURL', {
    configurable: true,
    writable: true,
    value: () => {
      return 'blob:mock';
    },
  });
}
