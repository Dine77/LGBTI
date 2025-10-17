import ReactECharts from "echarts-for-react";

const BarChartVerti = () => {
    const option = {
        xAxis: {
            type: "category",
            data: ["Daily", "A few times a week", "Once a week", "Once a month", "Once in few months", "Rarely", "Never"],
        },
        grid: {
            top: "5%",
            left: "10%",
            right: "10%",
            bottom: "5%",
            containLabel: true,
        },
        yAxis: {
            type: "value",
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: "bar",
            },
        ],
    };

    return (
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    );
};

const BarChartHori = () => {
    const option = {
        xAxis: {
            type: "value",
        },
        grid: {
            top: "5%",
            left: "5%",
            right: "10%",
            bottom: "5%",
            containLabel: true,
        },
        yAxis: {
            type: "category",
            data: ["Basic Phone", "Smartphone", "Laptop", "Desktop", "Tablet"],
            inverse: true,
        },
        series: [
            {
                data: [120, 200, 150, 80, 70],
                type: "bar",
            },
        ],
    };

    return (
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    );
};

const DonutChart = () => {
    const option = {
        tooltip: {
            trigger: "item",
        },
        legend: {
            top: "5%",
            left: "center",
        },
        series: [
            {
                name: "Access From",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: "#fff",
                    borderWidth: 2,
                },
                label: {
                    show: false,
                    position: "center",
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: "bold",
                    },
                },
                labelLine: {
                    show: false,
                },
                data: [
                    { value: 1048, name: "Female" },
                    { value: 735, name: "Male" },
                    { value: 580, name: "Intersex" },
                ],
            },
        ],
    };
    return (
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    );
};

const PieChart = () => {
    const option = {
        tooltip: {
            trigger: "item",
        },
        legend: {
            orient: "vertical",
            left: "left",
        },
        series: [
            {
                name: "Access From",
                type: "pie",
                radius: "50%",
                data: [
                    { value: 1048, name: "Lesbian" },
                    { value: 735, name: "Gay" },
                    { value: 580, name: "Bisexual" },
                    { value: 484, name: "Others" },
                ],
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
    return (
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
    );
};
export { BarChartVerti, BarChartHori, DonutChart, PieChart };
