import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Papa from 'papaparse'

//
// Define the shape of each raw CSV row (all values are strings)
//
interface RawEarthquakeRow {  
  id: string; time: string; latitude: string; longitude: string; depth: string;  
  mag: string; magType: string; nst: string; gap: string; dmin: string; rms: string;  
  net: string; updated: string; place: string; type: string;  
  horizontalError: string; depthError: string; magError: string; magNst: string;  
  status: string; locationSource: string; magSource: string;  
  [key: string]: string  
}

//
// Define internal, normalized model
//
export interface Earthquake {
  id: string
  time: string
  latitude: number
  longitude: number
  depth: number
  mag: number
  magType: string
  nst: number
  gap: number
  dmin: number
  rms: number
  net: string
  updated: string
  place: string
  type: string
  horizontalError: number
  depthError: number
  magError: number
  magNst: number
  status: string
  locationSource: string
  magSource: string
}

export interface DataState {
  items: Earthquake[]
  status: 'idle' | 'loading' | 'failed'
}

const initialState: DataState = {
  items: [],
  status: 'idle',
}

//
// Thunk to fetch & parse CSV
//
export const fetchEarthquakeData = createAsyncThunk<Earthquake[]>(
  'data/fetchEarthquakeData',
  async () => {
    const res = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv'
    )
    const text = await res.text()
    const parsed = Papa.parse<RawEarthquakeRow>(text, { header: true })
    return (parsed.data as RawEarthquakeRow[])
      .filter(r => r.id && r.time)
      .map(r => ({
        id: r.id,
        time: r.time,
        latitude: +r.latitude,
        longitude: +r.longitude,
        depth: +r.depth,
        mag: +r.mag,
        magType: r.magType,
        nst: +r.nst,
        gap: +r.gap,
        dmin: +r.dmin,
        rms: +r.rms,
        net: r.net,
        updated: r.updated,
        place: r.place,
        type: r.type,
        horizontalError: +r.horizontalError,
        depthError: +r.depthError,
        magError: +r.magError,
        magNst: +r.magNst,
        status: r.status,
        locationSource: r.locationSource,
        magSource: r.magSource,
      }))
  }
)

//
// Slice to manage fetch status & store the items
//
export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(fetchEarthquakeData.pending, state => {
        state.status = 'loading'
      })
      .addCase(
        fetchEarthquakeData.fulfilled,
        (state, action: PayloadAction<Earthquake[]>) => {
          state.items = action.payload
          state.status = 'idle'
        }
      )
      .addCase(fetchEarthquakeData.rejected, state => {
        state.status = 'failed'
      }),
})

export default dataSlice.reducer