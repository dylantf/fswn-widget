const DATA_URL =
  "http://cdn.weatherstem.com/dashboard/data/dynamic/weatherlinklive/001D0A7176C7.json";

export type Conditions = {
  data_structure_type: 1;
  dew_point: number;
  heat_index: number;
  hum: number;
  lsid: number;
  rain_rate_hi: number;
  rain_rate_hi_last_15_min: number;
  rain_rate_last: number;
  rain_size: number;
  rain_storm: number;
  rain_storm_last: number;
  rain_storm_last_end_at: number;
  rain_storm_last_start_at: number;
  rain_storm_start_at: number;
  rainfall_daily: number;
  rainfall_last_15_min: number;
  rainfall_last_24_hr: number;
  rainfall_last_60_min: number;
  rainfall_monthly: number;
  rainfall_year: number;
  rx_state: number;
  solar_rad: number;
  temp: number;
  thsw_index: number;
  thw_index: number;
  trans_battery_flag: number;
  txid: number;
  uv_index: number;
  wet_bulb: number;
  wind_chill: number;
  wind_dir_at_hi_speed_last_2_min: number;
  wind_dir_at_hi_speed_last_10_min: number;
  wind_dir_last: number;
  wind_dir_scalar_avg_last_1_min: number;
  wind_dir_scalar_avg_last_2_min: number;
  wind_dir_scalar_avg_last_10_min: number;
  wind_speed_avg_last_1_min: number;
  wind_speed_avg_last_2_min: number;
  wind_speed_avg_last_10_min: number;
  wind_speed_hi_last_2_min: number;
  wind_speed_hi_last_10_min: number;
  wind_speed_last: number;
};

export type ApiResponse = {
  ts: number;
  conditions: Array<
    { data_structure_type: 3 } | { data_structure_type: 4 } | Conditions
  >;
};

export async function loadData(): Promise<ApiResponse> {
  const res = await fetch(DATA_URL, {
    method: "GET",
    cache: "default",
  });

  return res.json();
}
