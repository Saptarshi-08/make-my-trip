import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Props {
    history: any[];
}

const PriceHistoryChart = ({ history }: Props) => {
    if (!history || history.length === 0) {
        return (
            <div className="border rounded-lg p-6 text-center text-gray-500">
                No price history available.
            </div>
        );
    }

    const chartData = history.map((item: any) => ({
        time: new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
        price: item.price,
    }));

    return (
        <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-lg mb-4">
                Price History
            </h3>

            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="time" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="price"
                        strokeWidth={3}
                        data={chartData}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceHistoryChart;