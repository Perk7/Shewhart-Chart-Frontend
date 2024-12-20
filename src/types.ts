export interface Config {
    characteristic: string,
    ma_span?: number,
    alpha?: number,
    betta?: number,
    delta?: number,
    limits: "Sigma"|"Custom",
    limitsValue: [number, number],
    chart: ChartName,
    sigmaDisplay: {
      sigma1: boolean,
      sigma2: boolean
    },
    mean: "Sample"|"Grand"|"Custom",
    meanCustom: number,
    sigma: "Calculate"|"Custom",
    sigmaCustom: number
}

export type ChartName = 'p'|'ma_p'|'ma_c'|'cusum_p'|'cusum_c'|'np'|'c'|'u'|'standartized_p'|'standartized_np'|'standartized_c'|'standartized_u'

export interface ChartData {
    type: ChartName,
    mean: number,
    values: Array<number>,

    lcl?: Array<number>,
    cl?: number,
    ucl?: Array<number>,
    sigmas?: Array<number>,
    total_sigma?: number,
    sigma?: number,
    corner?: {
        delta: number, d: number, tetta: number, h: number, f: number
    }
}

export interface TableData {
    parameters_quantity: number,
    subgroups_quantity: number,
    subgroups_size: number,
    parameters: Array<string>,
    additional_parameters: Array<string>,
    table: Array<TableDataValue>
}

export interface TableDataValue {
    subgroup: number,
    disabled: boolean,
    size: number
}