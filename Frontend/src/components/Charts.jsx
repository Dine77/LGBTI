import ReactECharts from "echarts-for-react";

// 📊 Vertical Bar Chart
const BarChartVerti = ({ data = [] }) => {
    const option = {
        tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: (params) => {
                const item = params[0];
                return `${item.name}: ${item.value}%`; // ✅ add % in tooltip
            },
            backgroundColor: "rgba(50,50,50,0.8)",
            textStyle: { color: "#fff", fontSize: 12 },
            borderRadius: 6,
            padding: [6, 10],
        },

        grid: { top: "5%", left: "5%", right: "5%", bottom: "10%", containLabel: true },

        xAxis: {
            type: "category",
            data: data.map((d) => d.name),
            axisLabel: { rotate: 30, fontSize: 10, color: "#333" },
            axisLine: { lineStyle: { color: "#ccc" } },
        },

        // ✅ Y-axis fixed 0–100, but hidden
        yAxis: {
            type: "value",
            min: 0,
            max: 100,
            show: false,
            splitLine: { show: false },
        },

        series: [
            {
                data: data.map((d) => parseFloat(d.value)),
                type: "bar",
                barWidth: "60%",
                itemStyle: {
                    borderRadius: [4, 4, 0, 0],
                    color: "#2e469c",
                },
                label: {
                    show: true,
                    position: "top",
                    formatter: ({ value }) => `${Math.round(value)}%`, // ✅ percentage on top
                    fontSize: 10,
                    color: "#333",
                },
            },
        ],
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: "100%", width: "100%" }}
        />
    );
};


// 📊 Horizontal Bar Chart
const BarChartHori = ({ data = [] }) => {
    const option = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        grid: { top: "5%", left: "10%", right: "10%", bottom: "10%", containLabel: true },
        xAxis: { type: "value" },
        yAxis: {
            type: "category",
            data: data.map((d) => d.name),
            inverse: true,
            axisLabel: { fontSize: 10 },
        },
        series: [
            {
                data: data.map((d) => parseFloat(d.value)),
                type: "bar",
                barWidth: "60%",
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />;
};

// 🍩 Donut Chart
const DonutChart = ({ data = [] }) => {
    const option = {
        tooltip: {
            formatter: ({ name, value }) => `${name}: ${Math.round(value)}%`,
        },

        series: [
            {
                name: "Responses",
                type: "pie",
                radius: ["30%", "50%"],
                center: ["50%", "50%"],
                itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2 },
                label: {
                    formatter: "{b}: {d}%",
                    fontSize: 11,
                },
                data: data.map((d) => ({
                    name: d.name,
                    value: parseFloat(d.value), // must stay numeric
                    label: {
                        show: true,
                        position: "outside",
                        formatter: ({ value, name }) => `${Math.round(value)}% : ${name}`, // ✅ add "%" only in display
                        color: "#333",
                        fontSize: 10,
                        fontWeight: "400",
                    },
                })),

            },
        ],
    };

    return <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />;
};

// 🥧 Pie Chart
const PieChart = ({ data = [] }) => {
    const option = {
        tooltip: { trigger: "item" },
        series: [
            {
                name: "Responses",
                type: "pie",
                radius: "55%",
                center: ["50%", "40%"],
                label: {
                    formatter: "{d}%:{b}",
                    fontSize: 11,
                },
                data: data.map((d) => ({
                    name: d.name,
                    value: parseFloat(d.value), // must stay numeric
                    label: {
                        show: true,
                        position: "outside",
                        formatter: ({ value, name }) => `${Math.round(value)}% : ${name}`, // ✅ add "%" only in display
                        color: "#333",
                        fontSize: 10,
                        fontWeight: "400",
                    },
                })),

                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />;
};

export { BarChartVerti, BarChartHori, DonutChart, PieChart };
