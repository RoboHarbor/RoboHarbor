import React from 'react';
import 'jsvectormap';
import 'jsvectormap/dist/maps/canada.js';

//components
import BaseVectorMap from './BaseVectorMap';

type CanadaVectorMapProps = {
    width?: string;
    height?: string;
    options?: Record<string, unknown>;
};

const CanadaVectorMap = ({ width, height, options }: CanadaVectorMapProps) => {
    return <BaseVectorMap width={width} height={height} options={options} type="canada" />;
};

export default CanadaVectorMap;
