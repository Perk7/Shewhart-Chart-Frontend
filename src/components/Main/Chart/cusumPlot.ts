import { ChartData, Config, TableData } from "../../../types";

function getSigma(plot: ChartData): number {
    return +plot.sigma.toFixed(4)
}

interface PlotLineItem {
  x: number, y: number
}

function getSeriesData(plot: ChartData): Array<PlotLineItem> {
    return plot.values.map((value, index) => ({
        x: index + 1,
        y: value
      }));
}

const plotTitles = {
    'cusum_p': "CUSUM for P"
}

export function getCusumOptions(plot: ChartData, config: Config, data: TableData) {
    const sigma = getSigma(plot)
    const seriesData = getSeriesData(plot)

    const clData = plot.values.map((_, index) => ({ x: index + 1, y: 0 }));

    let leftSide = plot.corner.h + plot.corner.f*10
    let xDiff = Math.abs(leftSide/Math.tan(plot.corner.tetta) - plot.corner.d)
    if (plot.values.length - xDiff <= 0) {
        leftSide -= (plot.corner.f*10)/xDiff*(plot.values.length - 1)
        xDiff = plot.values.length - 1
    } else {
        xDiff = +xDiff.toFixed(0)
    } 

    const rightTopVerticle = { x: plot.values.length, y: plot.corner.h }
    const topVerticle = { x: rightTopVerticle.x - xDiff, y: leftSide }
    const rightBottomVerticle = { x: plot.values.length, y: -plot.corner.h }
    const bottomVerticle = { x: rightBottomVerticle.x - xDiff, y: -leftSide }
    
    const sigmaLines = [];
    if (config.sigmaDisplay.sigma1) {
      sigmaLines.push(
        {
          data: plot.values.map((_, index) => ({ x: index + 1, y: -1*sigma })),
          title: '-1σ',
        }
      )
      sigmaLines.push(
        {
          data: plot.values.map((_, index) => ({ x: index + 1, y: 1*sigma })),
          title: '1σ',
        }
      )
    }
    if (config.sigmaDisplay.sigma2) {
        sigmaLines.push(
            {
              data: plot.values.map((_, index) => ({ x: index + 1, y: 2*sigma })),
              title: '2σ',
            },
          )
          sigmaLines.push(
            {
              data: plot.values.map((_, index) => ({ x: index + 1, y: -2*sigma })),
              title: '-2σ',
            }
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
          data: clData,
          showInLegend: false,
          stroke: 'gray',
          lineDash: [16, 5],
          marker: { enabled: false },
          tooltip: {
            enabled: false
          }
        },
        {
            data: [topVerticle, rightTopVerticle],
            type: 'line',
            xKey: 'x',
            yKey: 'y',
            stroke: 'black',
            marker: { enabled: false },
            showInLegend: false,
            tooltip: {
              enabled: false
            }
        },
        {
            data: [bottomVerticle, rightBottomVerticle],
            type: 'line',
            xKey: 'x',
            yKey: 'y',
            stroke: 'black',
            marker: { enabled: false },
            showInLegend: false,
            tooltip: {
              enabled: false
            }
        },
        {
            data: [rightTopVerticle, rightBottomVerticle],
            type: 'line',
            xKey: 'x',
            yKey: 'y',
            stroke: 'black',
            marker: { enabled: false },
            showInLegend: false,
            tooltip: {
              enabled: false
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
            size: 12
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
                }
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
          },
          interval: {
            step: + (plot.values[0]*3).toFixed(4)
          },
          min: Math.min(...plot.values, 0) - Math.min(...plot.values, 0)/10,
          max: Math.max(...plot.values, 0) + Math.max(...plot.values, 0)/10
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