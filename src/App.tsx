import React, { useEffect, useState } from "react";

import { Conditions, loadData } from "./api";

const REFRESH_INTERVAL = 1000 * 10; // 10 seconds

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
      if (reloadDataInterval) {
        window.clearInterval(reloadDataInterval);
        reloadDataInterval = null;
      }
    };
  }, []);

  const convertToKnots = (mph: number) => Math.round(mph * 0.868976);

  if (!conditions) return <>Loading data...</>;

  const curAvg = convertToKnots(conditions.wind_speed_last);
  const curHi = convertToKnots(conditions.wind_speed_hi_last_2_min);

  const lastAvg = convertToKnots(conditions.wind_speed_avg_last_10_min);
  const lastHi = convertToKnots(conditions.wind_speed_hi_last_10_min);

  const windDir = conditions.wind_dir_last;

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return null;
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatDirection = (deg: number) => {
    const between = (input: number) => (start: number, stop: number) =>
      input >= start && input < stop;
    const degBetween = between(deg);

    if (degBetween(11.25, 33.75)) return "NNE";
    if (degBetween(33.75, 56.25)) return "NE";
    if (degBetween(56.25, 78.75)) return "ENE";
    if (degBetween(78.75, 101.25)) return "E";
    if (degBetween(101.25, 123.75)) return "ESE";
    if (degBetween(123.75, 146.25)) return "SE";
    if (degBetween(146.25, 168.75)) return "SSE";
    if (degBetween(168.75, 191.25)) return "S";
    if (degBetween(191.25, 213.75)) return "SSW";
    if (degBetween(213.75, 236.25)) return "SW";
    if (degBetween(236.25, 258.75)) return "WSW";
    if (degBetween(258.75, 281.25)) return "W";
    if (degBetween(281.25, 303.75)) return "WNW";
    if (degBetween(303.75, 326.25)) return "NW";
    if (degBetween(326.25, 348.75)) return "NNW";
    else return "N";
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
        <div style={{ marginTop: "0px" }}>
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
