import { useAppSelector } from '../../hooks';
import Header from '../Header/Header';
import MagnitudeSlider from '../../reusables/MagnitudeSlider/MagnitudeSlider';
import SplitPane from '../SplitPane/SplitPane';
import PlotPane from '../PlotPane/PlotPane';
import TablePane from '../TablePane/TablePane';
import Spinner from '../../reusables/Spinner/Spinner';

export default function Layout() {
  const status = useAppSelector((s) => s.data.status);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3">
      <Header />

      <div className="flex-1 w-4/5 mx-auto px-4 py-3 flex flex-col overflow-hidden">
        <MagnitudeSlider className="mb-4" />

        {status === 'loading' ? (
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <Spinner />
          </div>
        ) : (
          <div className="flex-1 flex flex-row mobile:flex-col gap-3 overflow-hidden">
            <SplitPane
              pane1={<PlotPane />}
              pane2={<TablePane />}
              initialPercent={50}
              minSizePx={270}
            />
          </div>
        )}
      </div>
    </div>
  );
}
