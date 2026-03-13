import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function CurrentTime() {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timeout = setTimeout(() => setTime(new Date()), 1000);
        return () => clearTimeout(timeout);
    });
    const formattedTime = format(time, "h:mm:ss a");
    return <div>{formattedTime}</div>;
}
