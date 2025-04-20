import Header from '../Header/Header';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex overflow-hidden">
        <section className="w-1/2 border-r overflow-auto">Plot Pane</section>
        <section className="w-1/2 overflow-auto">Table Pane</section>
      </main>
    </div>
  );
}
