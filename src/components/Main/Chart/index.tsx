import React from 'react'
import { AgCharts } from 'ag-charts-react';

import { getDefaultOptions } from './defaultPlot';
import { getCusumOptions } from './cusumPlot';
import styles from './styles.module.scss'
import { ChartData, Config, TableData } from '../../../types';

interface ComponentProps {
  plotData: {
    plot: ChartData,
    data: TableData,
    config: Config
  }
  closeBtn: Function
}

export default function Chart({ plotData, closeBtn }: ComponentProps) {
  const { plot, data, config } = plotData
  
  const options = ['cusum_p', 'cusum_c'].includes(plot.type)
    ? getCusumOptions(plot, config, data)
    : getDefaultOptions(plot, config, data)

  return (<>
      <div className={styles.chartButtonWrapper}>
        <button className={styles.closeBtn} onClick={closeBtn}>Close</button>
      </div>
      <div className={styles.chartBlock}>
        <AgCharts options={options} className={styles.chart} />
      </div>
  </>)
}
