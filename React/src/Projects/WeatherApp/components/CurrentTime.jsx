import { useEffect, useState } from "react";

export default function CurrentTime() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timeout = setTimeout(() => setTime(new Date()), 1000);
        return () => clearTimeout(timeout);
    });
    return <div>{time.toTimeString()}</div>;
}
