import { Card, Dropdown } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const SalesChart = () => {
    const apexOpts: ApexOptions = {
        chart: {
            type: 'donut',
        },
        plotOptions: {
            pie: {
                expandOnClick: true,
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            formatter: (val: string) => {
                                return val;
                            },
                            offsetY: 4,
                            color: '#98a6ad',
                        },
                        value: {
                            show: true,
                            formatter: (val: string) => {
                                return val;
                            },
                            color: '#98a6ad',
                        },
                    },
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        colors: ['#6658dd', '#ff8acc', '#35b8e0'],
        legend: {
            show: true,
            position: 'bottom',
            height: 40,
            labels: {
                useSeriesColors: true,
            },
        },
        labels: ['In-Store Sales', 'Download Sales', 'Mail-Order Sales'],
        tooltip: {
            enabled: false,
        },
    };

    const apexData = [30, 12, 20];

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

                <h4 className="header-title mt-0">Daily Sales</h4>

                <div dir="ltr">
                    <Chart
                        options={apexOpts}
                        series={apexData}
                        type="donut"
                        height={302}
                        className="apex-charts mt-2"
                    />
                </div>
            </Card.Body>
        </Card>
    );
};

export default SalesChart;
