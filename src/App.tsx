import { useEffect } from 'react';
import { useAppDispatch } from './hooks'; // see step 6 below
import { fetchEarthquakeData } from './features/data/dataSlice';
import Layout from './components/Layout/Layout';
import './App.css';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchEarthquakeData());
  }, [dispatch]);

  return <Layout />;
}

export default App;
