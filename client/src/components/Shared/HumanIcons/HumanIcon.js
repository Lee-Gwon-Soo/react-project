import React from 'react';

//Man
import { Man0, Man1} from './Man/Man';
//Woman
import { Woman0, Woman1} from './Woman/Woman';

const mapToComponent = {
    'Man0': Man0,
    'Man1': Man1,
    'Woman0': Woman0,
    'Woman1': Woman1,
}

const HumanIcon = (props) => {
    const RenderIcon = mapToComponent[props.indexValue];
    return <RenderIcon {...props} />
}

export default HumanIcon;
