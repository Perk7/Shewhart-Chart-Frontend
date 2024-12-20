import { Config, TableData } from "./types";

export async function sendRequestForPlot(config: Config, data: TableData) {
    const url = "http://127.0.0.1:8000/process";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ config, data }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка: ", errorData);
        throw new Error(errorData.error || "Произошла ошибка запроса.");
      }
  
      const resp = await response.json();
      console.log("Ответ от сервера: ", resp);
  
      return resp; 
    } catch (error) {
      console.error("Ошибка при запросе к серверу: ", error);
      throw error;
    }
}