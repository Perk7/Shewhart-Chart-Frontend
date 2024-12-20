import { Cell, Column, Row } from "@silevis/reactgrid";
import { TableData, TableDataValue } from "../../../../types";

export function getColumns(data: TableData): Array<Column> {
    const resultList = [
        { columnId: "subgroup", width: 150, resizable: true },
        { columnId: "disabled", width: 150, resizable: true },
        { columnId: "size", width: 150, resizable: true }
    ];
    for (let i=0; i<data.parameters.length; i++)
        resultList.push({ columnId: data.parameters[i], width: 150, resizable: true })

    for (let i=0; i<data.additional_parameters.length; i++)
        resultList.push({ columnId: data.additional_parameters[i], width: 150, resizable: true })

    return resultList;
} 
  
export function headerRow(data: TableData): Row<Cell> {
    const resultObject = {
        rowId: "header",
        cells: [
          { type: "header", text: "Subgroup" },
          { type: "header", text: "Disabled" },
          { type: "header", text: "Size" }
        ]
    }
    for (let i=0; i<data.parameters.length; i++)
        resultObject.cells.push({ type: "header", text: data.parameters[i] })

    for (let i=0; i<data.additional_parameters.length; i++)
        resultObject.cells.push({ type: "header", text: data.additional_parameters[i] })

    return resultObject;
};
  
export function getRows(table: Array<TableDataValue>, data: TableData): Array<Row<Cell>> {
    return [
        headerRow(data),
        ...table.map((row, idx) =>  {
            const rows = [
                { type: "number", value: row.subgroup },
                { type: "checkbox", checked: row.disabled },
                { type: "number", value: row.size }
            ]
            for (let i=0; i<data.parameters.length; i++)
                rows.push({ type: "number", value: row[data.parameters[i]]})
        
            for (let i=0; i<data.additional_parameters.length; i++)
                rows.push({ type: "number", value: row[data.additional_parameters[i]]})

            return {
                rowId: idx,
                cells: rows
            }
        })
    ];
} 