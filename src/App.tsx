import React, { useEffect, useState } from "react";

import { Conditions, loadData } from "./api";

const REFRESH_INTERVAL = 1000 * 30; // milliseconds

let reloadDataInterval: NodeJS.Timer | null = null;

export const App: React.FC = () => {
  const [lastUpdated, setLastUpdated] = useState<number>();
  const [conditions, setConditions] = useState<Conditions>();

  useEffect(() => {
    async function updateData() {
      console.log("Loading data from FSWN API");
      const json = await loadData();
      const conditions = json.conditions.find(
        (c): c is Conditions => c.data_structure_type === 1
      );

      if (conditions) setConditions(conditions);
      if (json.ts) setLastUpdated(json.ts);
    }

    updateData();
    reloadDataInterval = setInterval(() => {
      console.log("Refreshing data");
      updateData();
    }, REFRESH_INTERVAL);

    return () => {
      reloadDataInterval = null;
    };
  }, []);

  const convertToKnots = (mph: number) => Math.round(mph * 0.868976);

  if (!conditions) return <>Loading data...</>;

  const curAvg = convertToKnots(conditions.wind_speed_avg_last_2_min);
  const curHi = convertToKnots(conditions.wind_speed_hi_last_2_min);

  const lastAvg = convertToKnots(conditions.wind_speed_avg_last_10_min);
  const lastHi = convertToKnots(conditions.wind_speed_hi_last_10_min);

  const windDir = conditions.wind_dir_scalar_avg_last_2_min;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;

    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatDirection = (deg: number) => {
    if (deg >= 348.75 || deg < 11.25) return "N";
    if (deg >= 11.25 && deg < 33.75) return "NNE";
    if (deg >= 33.75 && deg < 56.25) return "NE";
    if (deg >= 56.25 && deg < 78.75) return "ENE";
    if (deg >= 78.75 && deg < 101.25) return "E";
    if (deg >= 101.25 && deg < 123.75) return "ESE";
    if (deg >= 123.75 && deg < 146.25) return "SE";
    if (deg >= 146.25 && deg < 168.75) return "SSE";
    if (deg >= 168.75 && deg < 191.25) return "S";
    if (deg >= 191.25 && deg < 213.75) return "SSW";
    if (deg >= 213.75 && deg < 236.25) return "SW";
    if (deg >= 236.25 && deg < 258.75) return "WSW";
    if (deg >= 258.75 && deg < 281.25) return "W";
    if (deg >= 281.25 && deg < 303.75) return "WNW";
    if (deg >= 303.75 && deg < 326.25) return "NW";
    if (deg >= 326.25 && deg < 348.75) return "NNW";
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
      <img
        title={`${windDir}°`}
        src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Black_Down_Arrow.png?20091113220103"
        style={{
          width: "50px",
          height: "auto",
          transition: "all 1s ease-in",
          transform: `rotate(${windDir}deg)`,
        }}
      />
      <div style={{ fontSize: "18pt", marginTop: "14px" }}>
        <strong title={`${windDir}°`}>{formatDirection(windDir)}</strong>{" "}
        <strong>{curAvg}</strong>
        {curAvg !== curHi && (
          <>
            {" "}
            <span style={{ fontSize: "14pt" }}>to</span>{" "}
            <strong>{curHi}</strong>
          </>
        )}{" "}
        knots
      </div>

      <div style={{ marginTop: "10px", fontSize: "12pt" }}>
        10 minute average: {lastAvg} to {lastHi} knots
      </div>

      <div style={{ marginTop: "10px", fontSize: "8pt", color: "#999" }}>
        Last updated {formatDate(lastUpdated)}
        <div style={{ marginTop: "10px" }}>
          Data provided by{" "}
          <a
            href="https://palmbeach.weatherstem.com/fswndelraynorth"
            target="_blank"
          >
            WeatherSTEM Palm Beach
          </a>
        </div>
      </div>
    </div>
  );
};
