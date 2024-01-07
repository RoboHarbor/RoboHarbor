import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { Card, Dropdown } from 'react-bootstrap';

const StatisticsChart = () => {
    const apexOpts: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: '20%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: false,
        },
        xaxis: {
            categories: ['2010', '2011', '2012', '2013', '2014', '2015'],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                style: {
                    colors: '#adb5bd',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#adb5bd',
                },
            },
        },
        grid: {
            show: false,
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
        },
        fill: {
            opacity: 1,
        },
        colors: ['#188ae2'],
        tooltip: {
            theme: 'dark',
        },
    };

    const apexData = [
        {
            name: 'Statistics',
            data: [75, 42, 75, 38, 19, 93],
        },
    ];

    return (
        <Card>
            <Card.Body>
                <Dropdown className="float-end" align="end">
                    <Dropdown.Toggle as="a" className="cursor-pointer card-drop">
                        <i className="mdi mdi-dots-vertical"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>Action</Dropdown.Item>
                        <Dropdown.Item>Anothther Action</Dropdown.Item>
                        <Dropdown.Item>Something Else</Dropdown.Item>
                        <Dropdown.Item>Separated link</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <h4 className="header-title mt-0">Statistics</h4>

                <div dir="ltr">
                    <Chart options={apexOpts} series={apexData} type="bar" height={268} className="apex-charts mt-2" />
                </div>
            </Card.Body>
        </Card>
    );
};

export default StatisticsChart;
