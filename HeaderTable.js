import React,{Component} from 'react';
import PropTypes from 'prop-types';

export class HeaderTable extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const {title , width ,headerAlign , dataSort} = this.props;
        return(
            <th width={(width)?`${width}px`:''} style={{textAlign:((headerAlign)?`${headerAlign}`:'center')}}>
                { !dataSort ?
                    <span>{title}</span>
                    :<span style={{cursor:'pointer'}} onClick={()=>console.log("test")}>{title}</span>
                }
            </th>
        );
    }
}


HeaderTable.propTypes = {
    title: PropTypes.string.isRequired,
    dataField: PropTypes.string.isRequired,
    width: PropTypes.string,
    dataSort: PropTypes.bool,
    headerAlign:PropTypes.string,
    dataFormat: PropTypes.func,
    isRowNumber: PropTypes.bool
};