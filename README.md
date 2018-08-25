# DataTable
Reactjs Bootstrap DataTable 

<h2>Sample</h2>

```
import {DataTable, HeaderTable} from '../_components/Table';
import {Price} from '../_helpers';

function priceFormat(cell,row) {
    return (
        <Price value={cell} isText={true}/>
    );
}

...

<DataTable
  data={saving}
  keyField={"SavingId"}
  options={
      {
          previous:'قبلی',
          next:'بعدی'
      }
  }
  striped hover dark
  deleteRow
  deleteEvent={this.deleteEvent}>
  <HeaderTable title={"ردیف"} dataField={"SavingId"} width={"100"} isRowNumber={true} />
  <HeaderTable title={"تاریخ ثبت"} dataField={"CreateFDate"} dataSort />
  <HeaderTable title={"مبلغ پرداختی"} dataField={"Bes"} headerAlign={"right"} dataFormat={priceFormat} dataSort />
  <HeaderTable title={"مبلغ دریافتی"} dataField={"Bed"} headerAlign={"right"}  />
  <HeaderTable title={"سال"} dataField={"Year"} headerAlign={"right"}  dataSort/>
  <HeaderTable title={"ماه"} dataField={"Month"} headerAlign={"right"}  dataSort/>
</DataTable>

...

```

<h2>Props</h2>

<h3>DataTabel</h3>

```
{
    data: PropTypes.array.isRequired, // Table data list
    keyField: PropTypes.string.isRequired, // Primary key
    striped: PropTypes.bool, // Striped Bootstrap Style
    hover: PropTypes.bool, // Hover Bootstrap Style     
    dark: PropTypes.bool, // Dark Header Bootstrap Style
    deleteRow: PropTypes.bool, // Will the delete button be
    deleteEvent: PropTypes.func, // Deletion execution function    
    options:PropTypes.object // Options 
}
```

<h3>Header</h3>

```
{
    title: PropTypes.string.isRequired, // Title Header
    dataField: PropTypes.string.isRequired, // Field Name
    width: PropTypes.string, // Width Column
    dataSort: PropTypes.bool, // Sorted
    headerAlign:PropTypes.string,//align display the text
    dataFormat: PropTypes.func, // show custom text display
    isRowNumber: PropTypes.bool // Will the row index be displayed?
}
```
