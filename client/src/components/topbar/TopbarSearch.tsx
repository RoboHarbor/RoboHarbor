import { Link } from 'react-router-dom';
import Select, { components } from 'react-select';
import classNames from 'classnames';

// utils
import { groupByFields } from '../../utils';

// types
import { SearchOptions } from '../../layouts/types';

type TopbarSearchProps = {
    options: SearchOptions[];
};

/*
 * get options
 */
const optionGetter = (option: SearchOptions) => {
    switch (option.type) {
        case 'report':
            return (
                <Link to="#" className={classNames('dropdown-item', 'notify-item', 'p-0')}>
                    <i className={classNames(option.icon, 'me-1')}></i>
                    <span>{option.label}</span>
                </Link>
            );
        case 'help':
            return (
                <Link to="#" className={classNames('dropdown-item', 'notify-item', 'p-0')}>
                    <i className={classNames(option.icon, 'me-1')}></i>
                    <span>{option.label}</span>
                </Link>
            );
        case 'settings':
            return (
                <Link to="#" className={classNames('dropdown-item', 'notify-item', 'p-0')}>
                    <i className={classNames(option.icon, 'me-1')}></i>
                    <span>{option.label}</span>
                </Link>
            );
        case 'title':
            return (
                <div className="dropdown-header noti-title p-0">
                    <h6 className="text-overflow mb-2 text-uppercase">Users</h6>
                </div>
            );
        case 'users':
            return (
                <Link to="#" className="dropdown-item notify-item px-0">
                    <div className="d-flex">
                        <img
                            src={option.userDetails!.avatar}
                            alt=""
                            className="d-flex me-2 rounded-circle"
                            height="32"
                        />
                        <div>
                            <h5 className="drop-username m-0 font-14">
                                {option.userDetails!.firstname} {option.userDetails!.lastname}
                            </h5>
                            <span className="user-subinfo font-12 mb-0">{option.userDetails!.position}</span>
                        </div>
                    </div>
                </Link>
            );

        default:
            return;
    }
};

/*
 * filter options
 */
const formateOptions = (options: SearchOptions[]) => {
    const grouppedData = groupByFields(options, (item: SearchOptions) => {
        return [item.type];
    });

    let formattedOptions = [];
    let count = 0;

    for (let i = 0; i < grouppedData.length; i++) {
        for (let j = 0; j < grouppedData[i].length; j++) {
            if (grouppedData[i][j].type === 'users' && count === 0) {
                grouppedData[i].splice(j, 0, {
                    label: 'Users',
                    value: 'title',
                    type: 'title',
                });
                count = 1;
            }
            formattedOptions.push(grouppedData[i][j]);
        }
    }
    return formattedOptions;
};

/* custon indicator */
const IndicatorsContainer = (props: any) => {
    const { handleClick } = props.selectProps;
    return (
        <div style={{}}>
            <components.IndicatorsContainer {...props}>
                <button className="btn" onMouseDown={handleClick}>
                    <i className="fe-search"></i>
                </button>
            </components.IndicatorsContainer>
        </div>
    );
};

/* custom menu list */
const MenuList = (props: any) => {
    const { options } = props.selectProps;

    return (
        <components.MenuList {...props}>
            {/* menu header */}
            <div className="dropdown-header noti-title">
                <h5 className="text-overflow mb-2">
                    Found {options.length < 10 ? ('0' + options.length).slice(-2) : options.length} results
                </h5>
            </div>
            {props.children}
        </components.MenuList>
    );
};

/* fomates the option label */
const handleFormatOptionLabel = (option: SearchOptions) => {
    const formattedOption = optionGetter(option);
    return <div>{formattedOption}</div>;
};

const TopbarSearch = ({ options }: TopbarSearchProps) => {
    return (
        <Select
            components={{ IndicatorsContainer, MenuList }}
            placeholder={'Search...'}
            options={formateOptions(options)}
            formatOptionLabel={handleFormatOptionLabel}
            isOptionDisabled={(option) => option.type === 'title'}
            maxMenuHeight={350}
            isSearchable
            isClearable
            name="search-app"
            className="app-search"
            classNamePrefix="react-select"
        />
    );
};

export default TopbarSearch;
