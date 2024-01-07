import React from 'react';
import 'jsvectormap';
import 'jsvectormap/dist/maps/iraq.js';

//components
import BaseVectorMap from './BaseVectorMap';

type IraqVectorMapProps = {
    width?: string;
    height?: string;
    options?: Record<string, unknown>;
};

const IraqVectorMap = ({ width, height, options }: IraqVectorMapProps) => {
    return <BaseVectorMap width={width} height={height} options={options} type="iraq" />;
};

export default IraqVectorMap;
