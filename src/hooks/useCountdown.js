import { useEffect, useState } from "react";

export default function useCountdown(seconds) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (time <= 0) return;
    const t = setInterval(() => setTime((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [time]);

  const reset = () => setTime(seconds);

  return { time, reset };
}
