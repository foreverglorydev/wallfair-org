import { getServerTimeApi } from '../api/casino-games';

export const calculateTimeLeft = date => {
  if (!date) {
    return null;
  }

  const difference = date - new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export const nextDayweek = (d, weekday, time) => {
  d.setDate(d.getDate() + ((weekday + (7 - d.getDay())) % 7));
  d.setUTCHours(time.hour, time.minute, time.second);
  return d;
};

export const getServerTime = async () => {
  const startTime = Date.now();
  const time = await getServerTimeApi().catch((err)=> {
    console.error(err);
  });
  const endTime = Date.now();
  const requestDiff = endTime - startTime;

  const utcTime = new Date(time?.data?.utc).getTime();

  const serverTimestamp = utcTime + requestDiff;

  const finalServerTime = new Date(serverTimestamp);
  const clientNow = new Date();
  const clientServerDiff = clientNow - finalServerTime;

  const output = {
    serverPrecised: finalServerTime,
    clientServerOffsetMs: clientServerDiff,
    clientServerOffsetMin: clientServerDiff / 1000 / 60
  }

  return output;
}

export const getClientNow = (serverTimeOffset) => {
  return Date.now() + serverTimeOffset;
}
