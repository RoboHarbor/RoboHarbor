import { Card, Dropdown } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type StatisticsWidget1Props = {
    title: string;
    data: number;
    color: string;
    stats: number;
    subTitle: string;
};

const StatisticsWidget1 = ({ title, data, color, stats, subTitle }: StatisticsWidget1Props) => {
    const apexOpts: ApexOptions = {
        chart: {
            type: 'radialBar',
            sparkline: {
                enabled: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: '75%',
                },
                track: {
                    background: color,
                    opacity: 0.3,
                    margin: 0,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        show: true,
                        color: color,
                        fontWeight: 700,
                        fontSize: '14px',
                        offsetY: 5,
                        formatter: (val: number) => {
                            return String(val);
                        },
                    },
                },
            },
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                },
            },
        },
        colors: [color],
    };

    const apexData = [data];

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
                <h4 className="header-title mt-0 mb-4">{title}</h4>
                <div className="widget-chart-1">
                    <div className="widget-chart-box-1 float-start">
                        <Chart
                            options={apexOpts}
                            series={apexData}
                            type="radialBar"
                            width={77}
                            height={77}
                            className="apex-charts mt-0"
                        />
                    </div>
                    <div className="widget-detail-1 text-end">
                        <h2 className="fw-normal pt-2 mb-1">{stats}</h2>
                        <p className="text-muted mb-1">{subTitle}</p>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default StatisticsWidget1;
