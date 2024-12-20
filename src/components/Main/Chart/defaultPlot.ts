import { ChartData, Config, TableData } from "../../../types";

function getSigma(plot: ChartData): number {
    return +plot.total_sigma.toFixed(4)
}

interface PlotLineItem {
  x: number, y: number, isOutiler?: boolean
}

function getSeriesData(plot: ChartData): Array<PlotLineItem> {
    return plot.values.map((value, index) => ({
        x: index + 1,
        y: value,
        isOutlier: value < plot.lcl[index] || value > plot.ucl[index],
      }));
}

const plotTitles = {
    p: "P (Proportion)",
    np: 'nP (Number Nonconforming)',
    c: 'C (Number Nonconformities)',
    u: 'u (Average Nonconformities)',
    standartized_p: 'Standartized P',
    standartized_np: 'Standartized nP',
    standartized_c: 'Standartized C',
    standartized_u: 'Standartized u',
    cusum_p: "CUSUM for P",
    cusum_c: "CUSUM for C",
    ma_p: "Moving Average for P",
    ma_c: "Moving Average for C"
}

export function getDefaultOptions(plot: ChartData, config: Config, data: TableData) {
    const sigma = getSigma(plot)
    const seriesData = getSeriesData(plot)

    const lclData = plot.lcl.map((value, index) => ({ x: index + 1, y: value }));
    const uclData = plot.ucl.map((value, index) => ({ x: index + 1, y: value }));
    const clData = plot.values.map((_, index) => ({ x: index + 1, y: plot.cl }));
  
    const sigmaLines = [];
    if (config.sigmaDisplay.sigma1) {
      sigmaLines.push(
        {
          data: plot.sigmas.map((value, index) => ({ x: index + 1, y: plot.cl + 1*value })),
          title: '1σ',
        },
      )
      sigmaLines.push(
        {
          data: plot.sigmas.map((value, index) => ({ x: index + 1, y: plot.cl - 1*value })),
          title: '-1σ',
        }
      )
    }
    if (config.sigmaDisplay.sigma2) {
      sigmaLines.push(
        {
          data: plot.sigmas.map((value, index) => ({ x: index + 1, y: plot.cl - 2 * value })),
          title: '-2σ',
        },
      )
      sigmaLines.push(
        {
          data: plot.sigmas.map((value, index) => ({ x: index + 1, y: plot.cl + 2 * value })),
          title: '2σ',
        },
      )
    }
    
    return {
      title: {
        text: `${plotTitles[plot.type]}     (Mean = ${plot.mean.toFixed(4)}    Sigma = ${sigma})`,
      },
      series: [
        {
          type: 'line',
          xKey: 'x',
          yKey: 'y',
          data: lclData,
          stroke: 'blue',
          lineDash: [16, 5],
          marker: { enabled: false },
          title: 'LCL',
          tooltip: {
            enabled: true,
            renderer: ({ datum, xKey, yKey }) => ({
              heading: `LCL ${datum[xKey]}`,
              title: `Value: ${datum[yKey].toFixed(4)}`,
              data: [],
            })
          }
        },
        {
          type: 'line',
          xKey: 'x',
          yKey: 'y',
          data: uclData,
          stroke: 'blue',
          lineDash: [16, 5],
          marker: { enabled: false },
          title: 'UCL',
          tooltip: {
            enabled: true,
            renderer: ({ datum, xKey, yKey }) => ({
              heading: `UCL ${datum[xKey]}`,
              title: `Value: ${datum[yKey].toFixed(4)}`,
              data: [],
            })
          }
        },
        {
          type: 'line',
          xKey: 'x',
          yKey: 'y',
          data: clData,
          stroke: 'gray',
          lineDash: [16, 5],
          title: 'CL',
          marker: { enabled: false },
          yName: "CL",
          tooltip: {
            enabled: true,
            renderer: ({ datum, xKey, yKey }) => ({
              heading: 'CL',
              title: `Value: ${datum[yKey].toFixed(4)}`,
              data: [],
            })
          }
        },
        ...sigmaLines.map(({ data, title }) => ({
          type: 'line',
          xKey: 'x',
          yKey: 'y',
          data,
          stroke: 'lightgray',
          lineDash: [6, 6],
          marker: { enabled: false },
          showInLegend: false,
          tooltip: {
            enabled: true,
            renderer: ({ datum, xKey, yKey }) => ({
              heading: `${title} = ${datum[yKey].toFixed(4)}`,
              data: [],
            })
          }
        })),
        {
          type: 'line',
          xKey: 'x',
          yKey: 'y',
          data: seriesData,
          stroke: 'green',
          title: 'Points',
          marker: {
            stroke: "black",
            strokeWidth: 2,
            fill: 'green',
            size: 12,
            itemStyler: ({ datum }) => ({ fill: datum.isOutlier ? 'red' : 'green' }),
          },
          yName: 'Point',
          tooltip: {
            enabled: true,
            renderer: ({ datum, xKey, yKey }) => ({
              heading: `Sample size: ${data.table[datum[xKey] - 1].size}`,
              title: `Value: ${datum[yKey].toFixed(4)}`,
              data: [
                {
                    label: 'Point: ',
                    value: datum[xKey],
                },
                {
                  label: 'Status: ',
                  value: (datum.isOutlier ? 'Not in' : 'In') + ' control',
              },
            ],
            })
          }
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: 'Points',
          },
          label: {
            enabled: false
          }
        },
        {
          type: 'number',
          position: 'left',
          title: {
            text: 'Value',
          }
        }
      ],
      legend: {
        item: {
          line: {
              strokeWidth: 3,
              length: 40, 
          },
      },
      }
    };
}