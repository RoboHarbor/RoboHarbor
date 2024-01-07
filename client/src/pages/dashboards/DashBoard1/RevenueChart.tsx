import { Card, Dropdown } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const RevenueChart = () => {
    const options: ApexOptions = {
        chart: {
            height: 350,
            type: 'line',
            toolbar: {
                show: false,
            },
            stacked: false,
            zoom: {
                enabled: false,
            },
        },
        stroke: {
            curve: 'smooth',
            width: [3, 3],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        fill: {
            type: 'solid',
            opacity: [0, 1],
        },
        colors: ['#3cc469', '#188ae2'],
        xaxis: {
            categories: ['2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015'],
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
            tickAmount: 4,
            min: 0,
            max: 100,
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
                bottom: 0,
            },
        },
        tooltip: {
            theme: 'dark',
        },
    };

    const series = [
        {
            name: 'Series A',
            type: 'area',
            data: [50, 75, 30, 50, 75, 50, 75, 100],
        },
        {
            name: 'Series B',
            type: 'line',
            data: [0, 40, 80, 40, 10, 40, 50, 70],
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

                <h4 className="header-title mt-0">Total Revenue</h4>

                <div dir="ltr">
                    <Chart options={options} series={series} type="line" height={268} className="apex-charts mt-2" />
                </div>
            </Card.Body>
        </Card>
    );
};

export default RevenueChart;
