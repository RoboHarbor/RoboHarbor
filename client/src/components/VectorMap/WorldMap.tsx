import React from 'react';
import 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';

//components
import BaseVectorMap from './BaseVectorMap';

type WorldVectorMapProps = {
    width?: string;
    height?: string;
    options?: Record<string, unknown>;
};

const WorldVectorMap = ({ width, height, options }: WorldVectorMapProps) => {
    return <BaseVectorMap width={width} height={height} options={options} type="world" />;
};

export default WorldVectorMap;
