import { Config, TableData } from "../../../types"

export const initialConfig: Config = {
  characteristic: '',
  ma_span: 1,
  alpha: 0.005,
  betta: 0,
  delta: 1,
  limits: "Sigma",
  limitsValue: [-3, 3],
  chart: 'p',
  sigmaDisplay: {
    sigma1: true,
    sigma2: true
  },
  mean: "Sample",
  meanCustom: 0,
  sigma: "Calculate",
  sigmaCustom: 0
}

export function getDefaultObject(quantityDefects: number, rowsCount: number): TableData {
    const parameters = []
    for (let i=1;i<=quantityDefects;i++)
        parameters.push(`Defect ${i}`)

    const table = []
    for (let i=1;i<=rowsCount;i++) {
        const row = {
            "subgroup": i,
            "disabled": false,
            "size": 100
          }
          for (let i=1;i<=quantityDefects;i++)
            row[`Defect ${i}`] = 10

        table.push(row)
    }

    return {
        "parameters_quantity": quantityDefects,
        "subgroups_quantity": rowsCount,
        "subgroups_size": 100,
        "parameters": parameters,
        "additional_parameters": [],
        "table": table
      }
}