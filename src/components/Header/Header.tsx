import { useAppSelector, useAppDispatch } from '../../hooks';
import { toggleTheme } from '../../features/theme/themeSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const dark = useAppSelector((s) => s.theme.darkMode);

  const handleToggle = () => {
    dispatch(toggleTheme());
    document.documentElement.classList.toggle('dark', dark);
  };

  return (
    <header className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">Geospatial Earthquake Explorer</h1>
      <button
        onClick={handleToggle}
        aria-label="Toggle Dark Mode"
        className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      >
        {dark ? '🌙 Dark' : '☀️ Light'}
      </button>
    </header>
  );
}
