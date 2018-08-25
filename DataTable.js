import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import {ConfirmMessage} from '../../_components/Confirm';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import './css/DataTable.css';
import sort from './images/sort.png';
import sort_up from './images/sort-up.png';
import sort_down from './images/sort-down.png';
import sort_dark from './images/sort-dark.png';
import sort_up_dark from './images/sort-up-dark.png';
import sort_down_dark from './images/sort-down-dark.png';

function Data(props) {
    const {list, children, deleteRow, deleteEvent, keyField, page} = props;
    const pIndex = page.index * page.offset;
    const offsetList = list.slice(pIndex, page.offset + pIndex);

    const dataList = offsetList.map((item, index) =>
        <tr key={index}>
            {
                children.map((cell, i) =>
                    <td style={{textAlign: ((cell.headerAlign) ? cell.headerAlign : 'center')}} key={i}>
                        {
                            !cell.isRowNumber ?
                                ((!cell.dataFormat) ? item[`${cell.dataField}`] :
                                    cell.dataFormat(item[`${cell.dataField}`], item))
                                : (index + 1)
                        }
                    </td>
                )
            }
            {
                deleteRow &&
                <td>
                    <button onClick={() => deleteEvent(item[`${keyField}`])} className={"btn btn-danger btn-sm"}>حذف
                    </button>
                </td>
            }
        </tr>
    );

    return (
        <tbody>
        {dataList}
        </tbody>
    )
}

function Header(props) {
    const {list, deleteRow, sortItem, dark, sortField, sortIndex} = props;
    let simgOrg = (dark) ? sort : sort_dark;
    let simg = sort;
    if (dark) {
        simg = (sortField != '' && sortIndex == 1) ? sort_up : sort_down;
    } else {
        simg = (sortField != '' && sortIndex == 1) ? sort_up_dark : sort_down_dark;
    }
    const headList = list.map((item, index) =>
        <th key={index} width={(item.width) ? `${item.width}px` : ''}
            style={{textAlign: ((item.headerAlign) ? `${item.headerAlign}` : 'center')}}>
            {!item.dataSort ?
                <span>{item.title}</span>
                : <span
                    className={"DT_button"}
                    onClick={() => sortItem(item.dataField)}
                >{item.title + " "}<img src={(sortField != item.dataField) ? simgOrg : simg}/></span>
            }
        </th>
    );

    return (
        <tr>
            {headList}
            {
                deleteRow &&
                <th>عملیات</th>
            }
        </tr>
    );
}

function Footer(props) {
    const {page, pageClick,options} = props;
    console.log(page.total);
    const ar = [];
    for (var i = 0; i < page.total; i++)
        ar.push(i);
    const pageList = ar.map((item, index) =>
        <li key={index} className={"page-item " + ((page.index == index) ? 'active' : '')}>
            <button className="page-link" onClick={() => pageClick(index)}>{index + 1}</button>
        </li>
    );

    return (
        <div>
            <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                    <li className={"page-item " + ((page.index == 0 || page.total < 2) ? 'disabled' : '')}>
                        <button className="page-link" onClick={() => pageClick(page.index - 1)}>
                            {(options && options.previous)?options.previous:'Previous'}
                        </button>
                    </li>
                    {pageList}
                    <li className={"page-item " + ((page.total == page.index + 1 || page.total < 2) ? 'disabled' : '')}>
                        <button className="page-link" onClick={() => pageClick(page.index + 1)}>
                            {(options && options.next)?options.next:'Next'}
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export class DataTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            child: [],
            deleteId: -1,
            sortField: '',
            sortIndex: 0,
            page: {
                index: 0,
                total: 1,
                offset: 25
            }
        }

        this.deleteEvent = this.deleteEvent.bind(this);
        this.deletConfirm = this.deletConfirm.bind(this);
        this.sortItem = this.sortItem.bind(this);
        this.search = this.search.bind(this);
        this.pageClick = this.pageClick.bind(this);
        this.changeOffset = this.changeOffset.bind(this);
    }

    deleteEvent(id) {
        this.setState({deleteId: id});
        this.refs.confirm
            .show();
    }

    deletConfirm() {
        const {deleteId} = this.state;
        const {deleteEvent} = this.props;

        deleteEvent(deleteId);
    }

    sortItem(df) {
        let {sortField, sortIndex} = this.state;
        if (df != sortField) {
            sortIndex = 0;
        }

        var byProperty = function (prop) {
            return function (a, b) {
                if (typeof a[prop] == "number") {
                    return ((sortIndex != 0) ? b[prop] - a[prop] : a[prop] - b[prop]);
                }
                else {
                    return ((sortIndex != 0) ? (b[prop] < a[prop]) ? -1 : ((b[prop] > a[prop]) ? 1 : 0) :
                        (a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0));
                }
            };
        };
        const {list} = this.state;
        list.sort(byProperty(df));

        sortField = df;
        sortIndex = (sortIndex == 0) ? 1 : 0;
        this.setState({sortIndex, sortField});

    }

    search(e) {
        const value = e.target.value;

        let {data} = this.props;
        if (value == '') {
            this.setState({list: data});
            return;
        }
        const {child} = this.state;
        let list = data.filter(function (item) {
            for (var i = 0; i < child.length; i++) {
                const result = String(item[`${child[i].dataField}`]).toLowerCase().indexOf(value.toLowerCase()) > -1;
                if (result)
                    return result;
            }

            return false;
        });

        let {page} = this.state;
        page.total = Math.round(list.length / page.offset);
        if (page.total < 1)
            page.total = 1;
        page.index = 0;

        this.setState({list, page});
    }

    pageClick(pageIndex) {
        const {page} = this.state;
        if (pageIndex < 0 || pageIndex > page.total - 1)
            return;

        page.index = pageIndex;
        this.setState({page});
    }

    changeOffset(e) {
        const {value} = e.target;
        let {page, list} = this.state;

        page.offset = parseInt(value);
        page.total = Math.round(list.length / page.offset);
        page.index = 0;
        if (page.total < 1)
            page.total = 1;

        this.setState({page});

    }

    componentWillReceiveProps(nextProps) {
        const {data, children} = nextProps;
        if (data != []) {
            let {page} = this.state;
            page.total = Math.round(data.length / page.offset);
            if (page.total <= 0)
                page.total = 1;

            this.setState({list: data, page});

            let child = [];
            React.Children.forEach(children, element => {
                if (!React.isValidElement(element)) return;
                const {props} = element;
                child.push(props);
            });
            this.setState({child});
        }
    }


    render() {
        const {children, striped, hover, deleteRow, keyField, dark , options} = this.props;
        const {list, page} = this.state;


        let child = [];
        React.Children.forEach(children, element => {
            if (!React.isValidElement(element)) return;
            const {props} = element;
            child.push(props);
        });

        return (
            <div>
                <div className={"form-row"}>
                    <div className={"form-group col-md-3"}>
                        <input type={"text"} className={"form-control form-control-sm"}
                               placeholder={((options && options.searchPlaceholder)?options.searchPlaceholder:'Search ...')} onChange={this.search}/>
                    </div>
                    <div className={"form-group col-md-1"}>
                        <select className={"form-control form-control-sm"} value={page.offset} onChange={this.changeOffset}>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
                <table className={"table " + ((striped) ? ' table-striped ' : '') + ((hover) ? ' table-hover ' : '')}>
                    <thead className={((dark) ? 'thead-dark' : '')}>
                    <Header
                        dark={dark}
                        list={child}
                        deleteRow={deleteRow}
                        sortItem={this.sortItem}
                        sortField={this.state.sortField}
                        sortIndex={this.state.sortIndex}
                    />
                    </thead>
                    <Data
                        list={list}
                        children={child}
                        deleteRow={deleteRow}
                        deleteEvent={this.deleteEvent}
                        keyField={keyField}
                        page={page}
                    />
                </table>
                <Footer page={page} pageClick={this.pageClick} options={options}/>

                <ConfirmMessage
                    ref={"confirm"}
                    title={((options && options.DeleteTitle)?options.DeleteTitle:'Delete')}
                    message={((options && options.DeleteAlarm)?options.DeleteAlarm:"Will the data be deleted?")}
                    okTitle={((options && options.DeleteBtnOkTitle)?options.DeleteBtnOkTitle:"Delete")}
                    cancelTitle={((options && options.DeleteBtnOkCancel)?options.DeleteBtnOkCancel:"Cancel")}
                    onConfirm={this.deletConfirm}
                    confirmOptions={"danger"}
                    isRtl={((options && options.isRtl)?true:false)}
                />
            </div>
        );
    }
}


class ConfirmMessage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpened: false
        }
        this.onClose = this.onClose.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.show = this.show.bind(this);
    }


    onClose(event) {
        if (event) {
            event.stopPropagation();
        }
        this.setState({
            isOpened: false
        });

        if (typeof this.props.onClose === 'function') {
            this.props.onClose();
        }
    }

    onConfirm(event) {
        event.stopPropagation();
        this.setState({
            isOpened: false
        });
        this.props.onConfirm();
    }


    show() {
        this.setState({isOpened: true});
    }

    render() {
        const {title, message, okTitle, cancelTitle, confirmOptions, isRtl} = this.props;
        return (
            <div>
                <Modal isOpen={this.state.isOpened} toggle={this.onClose} className={((isRtl)?"rtl":"")}>
                    <ModalHeader toggle={this.onClose}>{title}</ModalHeader>
                    <ModalBody>
                        <p>{message}</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color={(confirmOptions) ? confirmOptions : "primary"}
                                onClick={this.onConfirm}>{okTitle}</Button>{' '}
                        <Button color="secondary" onClick={this.onClose}>{cancelTitle}</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}


ConfirmMessage.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    okTitle: PropTypes.string.isRequired,
    cancelTitle: PropTypes.string.isRequired,
    onConfirm: PropTypes.func,
    isRtl:PropTypes.bool,
    confirmOptions: PropTypes.oneOf(['primary', 'secondary', 'success', 'info', 'warning', 'danger'])
};


DataTable.propTypes = {
    data: PropTypes.array.isRequired,
    keyField: PropTypes.string.isRequired,
    striped: PropTypes.bool,
    hover: PropTypes.bool,
    exportCSV: PropTypes.bool,
    deleteRow: PropTypes.bool,
    deleteEvent: PropTypes.func,
    dark: PropTypes.bool,
    options:PropTypes.object
};

Header.propTypes = {
    list: PropTypes.array.isRequired,
    deleteRow: PropTypes.bool,
    sortItem: PropTypes.func,
    dark: PropTypes.bool,
    sortField: PropTypes.string,
    sortIndex: PropTypes.number
}