import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import classNames from "classnames";
import axios from "axios";

import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
} from "reactstrap";

import {
    chartExample4,
} from "variables/charts.js";

function RoomCharts() {
    const [fetchedData, setFetchedData] = useState({});
    const [bigChartData, setbigChartData] = React.useState("data1");

    const setBgChartData = (name) => {
        setbigChartData(name);
    };
    /* fetching data from the api for room/1*/
    const url = `http://127.0.0.1:8000/room/1`

    useEffect(() => {
        axios.get(`${url}`)

            .then((response) => {
                setFetchedData(response.data[0]);
            })
            .catch(error => console.error(`Error: ${error}`));
    }, []);

    //console.log(fetchedData);

    function timestampToHMS(timestamp) {
        var date = new Date(timestamp);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime
    }

    /* setting the options for the chart*/
    let chart1_2_options = {
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        tooltips: {
            backgroundColor: "#f5f5f5",
            titleFontColor: "#333",
            bodyFontColor: "#666",
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest",
        },
        responsive: true,
        scales: {
            yAxes: [
                {
                    barPercentage: 1.6,
                    gridLines: {
                        drawBorder: false,
                        color: "rgba(29,140,248,0.0)",
                        zeroLineColor: "transparent",
                    },
                    ticks: {
                        padding: 20,
                        fontColor: "#9a9a9a",
                    },
                },
            ],
            xAxes: [
                {
                    barPercentage: 1.6,
                    gridLines: {
                        drawBorder: false,
                        color: "rgba(29,140,248,0.1)",
                        zeroLineColor: "transparent",
                    },
                    ticks: {
                        callback: (val) => timestampToHMS(val),
                        padding: 20,
                        fontColor: "#9a9a9a",

                    },
                },
            ],
        },
    };

    /* Setting the the data fetched to chart 1*/
    const chartExample1 = {
        data1: (canvas) => {
            let ctx = canvas.getContext("2d");

            let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

            gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
            gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
            gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors 
            return {
                labels: fetchedData.x,
                datasets: [
                    {
                        label: "Sound Level for Room A on 2015-12-31",
                        fill: true,
                        backgroundColor: gradientStroke,
                        borderColor: "#1f8ef1",
                        borderWidth: 2,
                        borderDash: [],
                        borderDashOffset: 0.0,
                        pointBackgroundColor: "#1f8ef1",
                        pointBorderColor: "rgba(255,255,255,0)",
                        pointHoverBackgroundColor: "#1f8ef1",
                        pointBorderWidth: 20,
                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 15,
                        pointRadius: 2,
                        data: fetchedData.dB,
                    },
                ],
            };
        },
        data2: (canvas) => {
            let ctx = canvas.getContext("2d");

            let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

            gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
            gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
            gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

            return {
                labels: fetchedData.x,
                datasets: [
                    {
                        label: "My First dataset",
                        fill: true,
                        backgroundColor: gradientStroke,
                        borderColor: "#1f8ef1",
                        borderWidth: 2,
                        borderDash: [],
                        borderDashOffset: 0.0,
                        pointBackgroundColor: "#1f8ef1",
                        pointBorderColor: "rgba(255,255,255,0)",
                        pointHoverBackgroundColor: "#1f8ef1",
                        pointBorderWidth: 20,
                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 15,
                        pointRadius: 4,
                        data: fetchedData.pitch,
                    },
                ],
            };
        },
        data3: (canvas) => {
            let ctx = canvas.getContext("2d");

            let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

            gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
            gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
            gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

            return {
                labels: [
                    "JAN",
                    "FEB",
                    "MAR",
                    "APR",
                    "MAY",
                    "JUN",
                    "JUL",
                    "AUG",
                    "SEP",
                    "OCT",
                    "NOV",
                    "DEC",
                ],
                datasets: [
                    {
                        label: "My First dataset",
                        fill: true,
                        backgroundColor: gradientStroke,
                        borderColor: "#1f8ef1",
                        borderWidth: 2,
                        borderDash: [],
                        borderDashOffset: 0.0,
                        pointBackgroundColor: "#1f8ef1",
                        pointBorderColor: "rgba(255,255,255,0)",
                        pointHoverBackgroundColor: "#1f8ef1",
                        pointBorderWidth: 20,
                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 15,
                        pointRadius: 4,
                        data: [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130],
                    },
                ],
            };
        },
        options: chart1_2_options,
    };
    //console.log(fetchedData);

    function soundsAvg(sound, xlabels, periods) {
        var averages = [], labels = [];

        var i, j, temporary, chunk = 10;
        for (i = 0, j = 37; i < j; i += chunk) {
            temporary = sound.slice(i, i + chunk);
            labels.push(sound.slice(i, i + chunk));
            averages.push(temporary.reduce((a, b) => (a + b)) / 4);
        }

        console.log(averages);
        console.log(labels);

    };

   // soundsAvg(fetchedData.dB, fetchedData.x, 9);

    let chartExample2 = {
        data: (canvas) => {
            let ctx = canvas.getContext("2d");

            let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

            gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
            gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
            gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

            return {
                labels: ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
                datasets: [
                    {
                        label: "Data",
                        fill: true,
                        backgroundColor: gradientStroke,
                        borderColor: "#1f8ef1",
                        borderWidth: 2,
                        borderDash: [],
                        borderDashOffset: 0.0,
                        pointBackgroundColor: "#1f8ef1",
                        pointBorderColor: "rgba(255,255,255,0)",
                        pointHoverBackgroundColor: "#1f8ef1",
                        pointBorderWidth: 20,
                        pointHoverRadius: 4,
                        pointHoverBorderWidth: 15,
                        pointRadius: 4,
                        data: [80, 100, 70, 80, 120, 80],
                    },
                ],
            };
        },
        options: chart1_2_options,
    };

    var min = Math.min.apply(Math, fetchedData.dB),
        max = Math.max.apply(Math, fetchedData.dB)

    let chartExample3 = {
        data: (canvas) => {
            let ctx = canvas.getContext("2d");

            let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

            gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
            gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
            gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

            return {
                labels: ["Min", "Max"],
                datasets: [
                    {
                        label: "Minimum and Maximum dB",
                        fill: true,
                        backgroundColor: gradientStroke,
                        hoverBackgroundColor: gradientStroke,
                        borderColor: "#d048b6",
                        borderWidth: 2,
                        borderDash: [],
                        borderDashOffset: 0.0,
                        data: [min, max],
                    },
                ],
            };
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            tooltips: {
                backgroundColor: "#f5f5f5",
                titleFontColor: "#333",
                bodyFontColor: "#666",
                bodySpacing: 4,
                xPadding: 12,
                mode: "nearest",
                intersect: 0,
                position: "nearest",
            },
            responsive: true,
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            drawBorder: false,
                            color: "rgba(225,78,202,0.1)",
                            zeroLineColor: "transparent",
                        },
                        ticks: {
                            padding: 20,
                            fontColor: "#9e9e9e",
                        },
                    },
                ],
                xAxes: [
                    {
                        gridLines: {
                            drawBorder: false,
                            color: "rgba(225,78,202,0.1)",
                            zeroLineColor: "transparent",
                        },
                        ticks: {
                            padding: 20,
                            fontColor: "#9e9e9e",
                        },
                    },
                ],
            },
        },
    };

    return (
        <>
            <div className="content">
                <Row>
                    <Col xs="12">
                        <Card className="card-chart">
                            <CardHeader>
                                <Row>
                                    <Col className="text-left" sm="6">
                                        <h5 className="card-category">Decibels</h5>
                                        <CardTitle tag="h2">Room A 31st December 2015</CardTitle>
                                    </Col>
                                    <Col sm="6">
                                        <ButtonGroup
                                            className="btn-group-toggle float-right"
                                            data-toggle="buttons"
                                        >
                                            <Button
                                                tag="label"
                                                className={classNames("btn-simple", {
                                                    active: bigChartData === "data1",
                                                })}
                                                color="info"
                                                id="0"
                                                size="sm"
                                                onClick={() => setBgChartData("data1")}
                                            >
                                                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                                    Decibels
                                                </span>
                                                <span className="d-block d-sm-none">
                                                    <i className="tim-icons icon-single-02" />
                                                </span>
                                            </Button>
                                            <Button
                                                color="info"
                                                id="1"
                                                size="sm"
                                                tag="label"
                                                className={classNames("btn-simple", {
                                                    active: bigChartData === "data2",
                                                })}
                                                onClick={() => setBgChartData("data2")}
                                            >
                                                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                                    Pitch
                                                </span>
                                                <span className="d-block d-sm-none">
                                                    <i className="tim-icons icon-gift-2" />
                                                </span>
                                            </Button>
                                            <Button
                                                color="info"
                                                id="2"
                                                size="sm"
                                                tag="label"
                                                className={classNames("btn-simple", {
                                                    active: bigChartData === "data3",
                                                })}
                                                onClick={() => setBgChartData("data3")}
                                            >
                                                <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                                                    Decibels & Pitch
                                                </span>
                                                <span className="d-block d-sm-none">
                                                    <i className="tim-icons icon-tap-02" />
                                                </span>
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-area">
                                    <Line
                                        data={chartExample1[bigChartData]}
                                        options={chartExample1.options}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col lg="4">
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Total Shipments</h5>
                                <CardTitle tag="h3">
                                    <i className="tim-icons icon-bell-55 text-info" /> 763,215
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-area">
                                    <Line
                                        data={chartExample2.data}
                                        options={chartExample2.options}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Minimum and Maximum</h5>
                                <CardTitle tag="h3">
                                    <i className="tim-icons icon-bell-55 text-primary" />{" "}
                                    {min.toFixed(1)}dB to {max.toFixed(1)}dB
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-area">
                                    <Bar
                                        data={chartExample3.data}
                                        options={chartExample3.options}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="4">
                        <Card className="card-chart">
                            <CardHeader>
                                <h5 className="card-category">Completed Tasks</h5>
                                <CardTitle tag="h3">
                                    <i className="tim-icons icon-send text-success" /> 12,100K
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <div className="chart-area">
                                    <Line
                                        data={chartExample4.data}
                                        options={chartExample4.options}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    )

}

export default RoomCharts;


