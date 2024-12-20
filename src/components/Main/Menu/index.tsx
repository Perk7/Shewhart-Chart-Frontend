import React, { useState, useRef, useEffect } from 'react'

import Table from './Table'
import Modal from './Modal';

import { getDefaultObject, initialConfig } from './initialStates';
import dataParser from './dataParser'
import styles from './styles.module.scss'
import { Config, TableData } from '../../../types';

interface ComponentProps {
  createPlot: Function,
  parsedData: TableData,
  setParsedData: Function
}

export default function Menu({ createPlot, parsedData, setParsedData }: ComponentProps) {
  const [config, setConfig] = useState<Config>(initialConfig)
  const [filename, setFileName] = useState<string>(localStorage.getItem('filename') || '')
  const [error, setError] = useState<string>(null);

  const [modalActive, setModalActive] = useState<boolean>(false)
  const fileInputRef = useRef(null)

  const [quantityColumn, setQuantityColumn] = useState<number>(2);
  const [quantityRow, setQuantityRow] = useState<number>(8);

  useEffect(() => {
    if (!parsedData)
      setParsedData(getDefaultObject(2, 8))
  })

  useEffect(() => {
    if (parsedData)
      localStorage.setItem('dataTable', JSON.stringify(parsedData))
  }, [parsedData])

  function parseFile(content: string): TableData {
    try {
      const data = dataParser(content)
      setError(null);
      return data
    } catch (err) {
      setError("Failed. Please check the file format.");
      return null
    }
  };

  function handleFileChange(event: React.FormEvent<HTMLInputElement>): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result.toString();
        const data = parseFile(content);
        setParsedData(data);
        let selectedFilename = file.name
        if (selectedFilename.length > 20)
          selectedFilename = selectedFilename.slice(6) + '...' + selectedFilename.slice(-6)
        localStorage.setItem('filename', selectedFilename);
        setFileName(selectedFilename)
      } catch (err) {
        setParsedData(null);
        setError(err.message);
      }
    };
    reader.readAsText(file);
  };

  function openModal(): void {
    setModalActive(!modalActive)
  }

  function clearFile(): void {
    setFileName('')
    localStorage.removeItem('filename');
    setError(null)
    setParsedData(getDefaultObject(quantityColumn, quantityRow))
    fileInputRef.current.value = ''
  }

  function createTable(): void {
    setParsedData(getDefaultObject(quantityColumn, quantityRow))
  }

  return (
    <div className={styles.menuBlock}>
      <div className={styles.buttonBlock}>
        <div>
          <div>
            <label className={styles.fileSelectBlock}>
                <input ref={fileInputRef} type="file" accept="text/plain,.qcc" onChange={handleFileChange} />	
                <span>{filename || 'Select file problem'}</span>
            </label>
            {filename && <button onClick={clearFile} className={styles.fileResetBtn}>Clear</button>}
          </div>
          <button className={styles.createBtn} onClick={openModal}>Create chart</button>
          <div className={styles.errorLabel}>{error}</div>
        </div>  
        {!filename && <div className={styles.customTableBlock}>
          <div className={styles.quantityForm}>
            <label className={styles.tableSizeLabel}>
              <span>Columns (min: 1, max: 10):</span>
              <input 
                className={(quantityColumn < 1 || quantityColumn > 10) ? styles.errorSize : ''} 
                type="number" value={quantityColumn} onChange={e => setQuantityColumn(e.target.value)} 
              />
            </label>
            <label className={styles.tableSizeLabel}>
              <span>Rows (min: 1, max: 100):</span>
              <input 
                className={(quantityRow < 1 || quantityRow > 100) ? styles.errorSize : ''} 
                type="number" value={quantityRow} onChange={e => setQuantityRow(e.target.value)} 
              />
            </label>
          </div>
          <button
          disabled={(quantityRow < 1 || quantityRow > 100) || (quantityColumn < 1 || quantityColumn > 10)}
          className={styles.createBtn} onClick={createTable}
          >Update table</button>
        </div>}
      </div>
      <div className={styles.tableBlock}>
        {parsedData &&
            <Table 
              onChangeData={setParsedData} data={parsedData} 
              quantityColumn={parsedData.parameters.length} quantityRow={1} 
            />
        }
      </div>
      {modalActive 
        && 
        <Modal 
          createPlot={createPlot} config={config} 
          setConfig={setConfig} data={parsedData} 
          closeModal={() => setModalActive(false)}
        />
      }
    </div>
  )
}