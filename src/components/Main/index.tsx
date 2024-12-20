import React, { useState } from 'react'

import Chart from './Chart'
import Menu from './Menu'
import { sendRequestForPlot } from '../../requests'
import { ChartData, Config, TableData } from '../../types'

import styles from './styles.module.scss'

export default function Main() {
  const [plotData, setPlotData] = useState<ChartData>(JSON.parse(localStorage.getItem('dataChart')) || null) 
  const [parsedData, setParsedData] = useState<TableData>(JSON.parse(localStorage.getItem('dataTable')) || null);

  function createPlot(config: Config, data: TableData): void {
    sendRequestForPlot(config, data)
      .then(plot => {
        setPlotData({plot, data, config})
        localStorage.setItem('dataChart', JSON.stringify({plot, data, config}))
      })
      .catch(error => {
        setPlotData({})
        console.error("Ошибка: ", error.message);
      });
  }

  function closePlot(): void {
    setPlotData({})
    localStorage.removeItem('dataChart')
  }

  return (<div className={styles.mainWrapper}>
    <header>
      <h1>Shewhart control chart</h1>
    </header>
    <section className={styles.main__content}>
      {plotData?.plot?.type
        ? <Chart closeBtn={closePlot} plotData={plotData} />
        : <Menu createPlot={createPlot} parsedData={parsedData} setParsedData={setParsedData} />}
    </section>
  </div>)
}