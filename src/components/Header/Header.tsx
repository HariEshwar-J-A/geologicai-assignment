import { useState } from 'react';

export default function Header() {
  const [dark, setDark] = useState(false);
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800">
      <h1 className="text-xl font-bold">Geo‑Stats SPA</h1>
      <button
        onClick={() => setDark(!dark)}
        aria-label="Dark Mode"
        className="p-2"
      >
        {dark ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
