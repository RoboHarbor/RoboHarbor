import React from 'react';
import 'jsvectormap';
import 'jsvectormap/dist/maps/russia.js';

//components
import BaseVectorMap from './BaseVectorMap';

type RussiaVectorMapProps = {
    width?: string;
    height?: string;
    options?: Record<string, unknown>;
};

const RussiaVectorMap = ({ width, height, options }: RussiaVectorMapProps) => {
    return <BaseVectorMap width={width} height={height} options={options} type="russia" />;
};

export default RussiaVectorMap;
