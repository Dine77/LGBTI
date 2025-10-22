import ReactECharts from "echarts-for-react";

// 📊 Vertical Bar Chart
const BarChartVerti = ({ data = [] }) => {
    const option = {
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        grid: { top: "5%", left: "10%", right: "10%", bottom: "10%", containLabel: true },
        xAxis: {
            type: "category",
            data: data.map((d) => d.name),
            axisLabel: { rotate: 30, fontSize: 10 },
        },
        yAxis: { type: "value" },
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
        tooltip: { trigger: "item" },
        legend: { top: "5%", left: "center" },
        series: [
            {
                name: "Responses",
                type: "pie",
                radius: ["30%", "50%"],
                itemStyle: { borderRadius: 10, borderColor: "#fff", borderWidth: 2 },
                label: {
                    formatter: "{b}: {d}%",
                    fontSize: 11,
                },
                data: data.map((d) => ({ name: d.name, value: parseFloat(d.value) })),
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />;
};

// 🥧 Pie Chart
const PieChart = ({ data = [] }) => {
    console.log(data);
    const option = {
        tooltip: { trigger: "item" },
        legend: { orient: "vertical", left: "left" },
        series: [
            {
                name: "Responses",
                type: "pie",
                radius: "50%",
                label: {
                    formatter: "{b}: {d}%",
                    fontSize: 11,
                },
                data: data.map((d) => ({ name: d.name, value: parseFloat(d.value) })),
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
