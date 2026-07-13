import { useEffect, useState } from "react";

interface Props {
    frozen: boolean;
    expiry: string;
    onExpired?: () => void;
}

const PriceFreezeCard = ({
    frozen,
    expiry,
    onExpired,
}: Props) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (!frozen || !expiry) return;

        const interval = setInterval(() => {
            const diff =
                new Date(expiry).getTime() -
                Date.now();

            if (diff <= 0) {
                setTimeLeft("Expired");

                clearInterval(interval);

                onExpired?.();

                return;
            }

            const minutes = Math.floor(diff / 60000);

            const seconds = Math.floor(
                (diff % 60000) / 1000,
            );

            setTimeLeft(
                `${minutes}m ${seconds}s`,
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [frozen, expiry]);

    if (!frozen) return null;

    return (

        <div className="bg-green-50 border border-green-300 rounded-xl p-4 mt-4">

            <div className="flex justify-between items-center">

                <h3 className="font-bold text-green-700">

                    🧊 Price Locked

                </h3>

                <span className="text-xs bg-green-200 px-2 py-1 rounded">

                    ACTIVE

                </span>

            </div>

            <p className="text-sm mt-3">

                Time Remaining

            </p>

            <p className="font-bold text-2xl">

                {timeLeft}

            </p>

        </div>

    );
};

export default PriceFreezeCard;