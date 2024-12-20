import React, { useEffect, useState } from 'react'
import { ReactGrid, CellChange, Id, NumberCell, CheckboxCell, Column, Row, Cell } from "@silevis/reactgrid";

import { TableData, TableDataValue } from '../../../../types';

import { getColumns, getRows } from './parsedTable';
import './styles.scss'

interface ComponentProps {
  onChangeData: Function,
  quantityColumn: number,
  quantityRow: number,
  data: TableData
}

export default function Table({ onChangeData, quantityColumn, quantityRow, data }: ComponentProps) {
  const [items, setItems] = useState<Array<TableDataValue>>([]);
  const [columns, setColumns] = useState<Array<Column>>([]);
  const [rows, setRows] = useState<Array<Row<Cell>>>([]);

  useEffect(() => {
    setItems(data.table)
    setColumns(getColumns(data))
  }, [data, quantityColumn, quantityRow])

  useEffect(() => {
    setRows(getRows(items, data))
    onChangeData({...data, table:data.table})
  }, [items])

  function applyChangesToRows(changes: CellChange<NumberCell|CheckboxCell>[], prevRow: Array<Row<Cell>>): Array<Row<Cell>> {
    changes.forEach((change) => {
      const rowId = change.rowId;
      const columnId = change.columnId;

      if (change.newCell.type === 'number')
        prevRow[rowId][columnId] = change.newCell.value;
      else
        prevRow[rowId][columnId] = change.newCell.checked;
    });

    return [...prevRow];
  };

  function handleChanges(changes: CellChange<NumberCell>[]): void { 
    setItems(prevRow => {
      onChangeData(() => ({...data, table: applyChangesToRows(changes, prevRow)}))
      return applyChangesToRows(changes, prevRow)
    });
  }; 

  function handleColumnResize(ci: Id, width: number): void {
    setColumns((prevColumns) => {
        const columnIndex = prevColumns.findIndex(el => el.columnId === ci);
        const resizedColumn = prevColumns[columnIndex];
        const updatedColumn = { ...resizedColumn, width };
        prevColumns[columnIndex] = updatedColumn;

        return [...prevColumns];
    });
  }
  
  return (
    <ReactGrid 
      rows={rows} columns={columns}  
      enableFillHandle 
      enableRowSelection enableColumnSelection
      onCellsChanged={handleChanges} onColumnResized={handleColumnResize}  
    />)
}