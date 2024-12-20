import React, { useEffect, useState } from 'react'

import { Config, TableData } from '../../../../types'

import { charts } from './charts'
import styles from './styles.module.scss'

interface ComponentProps {
  config: Config, 
  setConfig: Function, 
  data: TableData, 
  createPlot: Function, 
  closeModal: Function
}

export default function Modal({ config, setConfig, data, createPlot, closeModal }: ComponentProps) {
  const [createDisabled, setCreateDisabled] = useState<boolean>(false)

  useEffect(() => {
    setConfig({...config, characteristic: data.parameters[0]})
  }, [])

  useEffect(() => {
    setCreateDisabled(
           (config.sigma === 'Custom' && (+config.sigmaCustom <= 0 || !+config.sigmaCustom)) 
            || 
           (config.mean === 'Custom' && (+config.meanCustom <= 0 || !+config.meanCustom))
            ||
           (["cusum_p", "cusum_c"].includes(config.chart) && (+config.betta < 0 || (!+config.betta && +config.betta !== 0)))
            ||
           (["cusum_p", "cusum_c"].includes(config.chart) && (+config.alpha < 0 || (!+config.alpha && +config.alpha !== 0)))
            ||
           (["cusum_p", "cusum_c"].includes(config.chart) && (+config.delta <= 0 || !+config.delta))
            ||
           (!["cusum_p", "cusum_c"].includes(config.chart) && !+config.limitsValue[1])
            ||
           (!["cusum_p", "cusum_c"].includes(config.chart) && !+config.limitsValue[0])
            ||
           (["ma_p", "ma_c"].includes(config.chart) && !+config.ma_span)
    )
  })

  function changeChartType(event: React.FormEvent<HTMLInputElement>): void {
    if (![...charts[event.target.value].average, "Custom"].includes(config.mean))
      setConfig({...config, mean: charts[event.target.value].average[0], chart: event.target.value})
    else
      setConfig({...config, chart: event.target.value})
  }

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalBlock}>
        <div className={styles.modalHeader}>
          <h2>Create chart</h2>
          <button onClick={closeModal}>Close</button>
        </div>
        <div className={styles.gridModalWrapper}>
          <section>
            <h3>Characteristic:</h3>
            <select value={config.characteristic} onChange={e => setConfig({...config, characteristic: e.target.value})}>
              {data.parameters.map(item => (
                <option value={item}>{item}</option>
              ))}
            </select>
          </section>

          <section>
            <h3>Sigma display:</h3>
            <label className={styles.checkboxLabel}>
              <span>Sigma 1</span>
              <input 
                type="checkbox" checked={config.sigmaDisplay.sigma1} 
                onChange={() => setConfig({...config, sigmaDisplay: {...config.sigmaDisplay, sigma1: !config.sigmaDisplay.sigma1}})} 
              />
            </label>

            <label className={styles.checkboxLabel}>
              <span>Sigma 2</span>
              <input 
                type="checkbox" checked={config.sigmaDisplay.sigma2} 
                onChange={() => setConfig({...config, sigmaDisplay: {...config.sigmaDisplay, sigma2: !config.sigmaDisplay.sigma2}})} 
              />
            </label>
          </section>

          <section>
            <h3>Mean:</h3>
            {charts[config.chart].average.map(variant => 
              <label className={styles.radioLabel}>
                <input 
                  type="radio" name="avg" checked={config.mean === variant} 
                  onChange={() => setConfig({...config, mean: variant})} 
                />
                <span>{variant} average</span>
              </label>
            )}
            <label className={styles.radioLabel}>
              <input 
                type="radio" name="avg" checked={config.mean === 'Custom'} 
                onChange={() => setConfig({...config, mean: 'Custom'})} 
              />
              <span>Custom value</span>
            </label>
            <label className={styles.textLabel}>
              <span>Mean = </span>
              <input 
                type="text" value={config.meanCustom} size="1" className={(config.mean === 'Custom' && (+config.meanCustom <= 0 || !+config.meanCustom)) ? styles.error : undefined}
                onChange={e => setConfig({...config, meanCustom: e.target.value})}  
              />
            </label>
          </section>

          <section>
            <h3>Chart Type:</h3>
            <select value={config.chart} onChange={changeChartType}>
              {Object.keys(charts).map(chart => (
                <option value={chart}>{charts[chart].title}</option>
              ))}
            </select>
          </section>

          <section>
            <h3>Parameters:</h3>
            {["cusum_p", "cusum_c"].includes(config.chart)
              ? <>
                <label className={styles.textLabel}>
                  <span>Alpha: </span>
                  <input 
                    type="text"  value={config.alpha} 
                    className={(+config.alpha < 0 || (!+config.alpha && +config.alpha !== 0)) ? styles.error : undefined}
                    onChange={e => setConfig({...config, alpha: e.target.value})}  
                  />
                </label>
                <label className={styles.textLabel}>
                  <span>Betta: </span>
                  <input 
                    type="text"  value={config.betta} 
                    className={(+config.betta < 0 || (!+config.betta && +config.betta !== 0)) ? styles.error : undefined}
                    onChange={e => setConfig({...config, betta: e.target.value})}  
                  />
                </label>
                <label className={styles.textLabel}>
                  <span>Delta: </span>
                  <input 
                    type="text"  value={config.delta} 
                    className={(+config.delta <= 0 || !+config.delta) ? styles.error : undefined}
                    onChange={e => setConfig({...config, delta: e.target.value})}  
                  />
                </label>
                </>
              : <>
                <label className={styles.textLabel}>
                  <span>UCL: </span>
                  <input type="text"  
                    value={config.limitsValue[1]} className={!+config.limitsValue[1] ? styles.error : undefined}
                    onChange={e => setConfig({...config, limitsValue: [config.limitsValue[0], e.target.value]})}  
                  />
                </label>
                <label className={styles.textLabel}>
                  <span>LCL: </span>
                  <input type="text"  
                    value={config.limitsValue[0]} className={!+config.limitsValue[0] ? styles.error : undefined}
                    onChange={e => setConfig({...config, limitsValue: [e.target.value, config.limitsValue[1]]})}
                  />
                </label>
              {["ma_p", "ma_c"].includes(config.chart)
                ? <label className={styles.textLabel}>
                    <span>MA span: </span>
                    <input type="text"  
                       value={config.ma_span} className={!+config.ma_span ? styles.error : undefined}
                       onChange={e => setConfig({...config, ma_span: e.target.value})}  
                    />
                  </label>
                : <>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="limits" 
                        checked={config.limits === 'Sigma'} 
                        onChange={() => setConfig({...config, limits: 'Sigma'})} 
                      />
                      <span>In sigma</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input type="radio" name="limits"
                        checked={config.limits === 'Custom'} 
                        onChange={() => setConfig({...config, limits: "Custom"})} 
                      />
                      <span>Custom value</span>
                    </label>
                  </>}
              </>
            }
          </section>

          <section>
            <h3>Sigma:</h3>
            <label className={styles.radioLabel}>
              <input type="radio" name="sigma" 
                checked={config.sigma === 'Calculate'} 
                onChange={() => setConfig({...config, sigma: "Calculate"})} 
              />
              <span>Calculate value</span>
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="sigma"
                checked={config.sigma === 'Custom'} 
                onChange={() => setConfig({...config, sigma: "Custom"})} 
              />
              <span>Custom value</span>
            </label>
            <label className={styles.textLabel}>
              <span>Sigma = </span>
              <input type="text"  value={config.sigmaCustom}  className={(config.sigma === 'Custom' && (+config.sigmaCustom <= 0 || !+config.sigmaCustom)) ? styles.error : undefined}
                onChange={e => setConfig({...config, sigmaCustom: e.target.value})}  
              />
            </label>
          </section>
          <section className={styles.createButton}>
            <button  disabled={createDisabled}  onClick={() => createPlot(config, data)}>Сreate</button>
          </section>
        </div>
      </div>
    </div>
  )
}
