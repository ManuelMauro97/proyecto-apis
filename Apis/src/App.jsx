import { Form } from "./components/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { stripHtml } from "string-strip-html";
import "./App.css";

export const App = () => {
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [disease, setDisease] = useState(null);
  const [diseaseName, setDiseaseName] = useState(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (disease) {
  //     getDiseaseInfoFromBackend(disease).then((summary) => {
  //       let newSummary = JSON.parse(summary)
  //       console.log(newSummary)
  //       console.log(newSummary?.elements[0]?.elements[7]?.elements[0]?.elements[4]?.elements[0]?.text)
  //       setDiseaseInfo(JSON.stringify(summary));
  //       setDiseaseName(disease);
  //     });
  //   }
  // }, [disease]);

  // useEffect(() => {
  //   if (disease) {
  //     getDiseaseInfoFromBackend(disease).then((summary) => {
  //       console.log(summary);
  //       // let newSummary = JSON.parse(summary);
  //       // let fullSummary = newSummary?.elements[0]?.elements[7]?.elements[0]?.elements[4]?.elements[0]?.text;
  //       let cleanSummary = stripHtml(summary).result;
  //       console.log(cleanSummary);
  //       setDiseaseInfo(cleanSummary);
  //       setDiseaseName(disease);
  //     });
  //   }
  // }, [disease]);

  useEffect(() => {
    if (disease) {
      getDiseaseInfoFromBackend(disease).then((summary) => {
        console.log("Respuesta del servidor:", summary);
        const fullSummaryRegex = /<content name="FullSummary">(.*?)<\/content>/s;
        // const fullSummaryRegex = /{"name":"FullSummary"},"elements":\[\{"type":"text","text":"(.*?)"\}\]},{"type":"element","name":"content"/s;
        const match = summary.match(fullSummaryRegex);
        console.log("Resultado de la coincidencia:", match);
        
        const fullSummary = match && match[1] ? match[1] : "No se encontró información para esta enfermedad.";
        let cleanSummary = stripHtml(fullSummary).result;
        setDiseaseInfo(cleanSummary);
        setDiseaseName(disease);
      });
    }
  }, [disease]);
  
  
  // console.log(typeof diseaseInfo)

  useEffect(() => {
    if (diseaseInfo !== null) {
      setLoading(false);
    }
  }, [diseaseInfo]);


  const handleSymptomSubmit = async (symptoms) => {
    setLoading(true);
    await getDisease(symptoms);
  };

  async function getDisease(symptoms) {
    const url = "http://localhost:5001/api/diagnose";

    try {
      const response = await axios.post(url, { symptoms });
      const diseaseResp = response.data.disease;
      setDisease(diseaseResp);
      return disease;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function getDiseaseInfoFromBackend(disease) {
    try {
      const response = await axios.get(`http://localhost:5001/api/disease-info/${disease}`);
      return response.data.summary;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return (
    <div className="container">
      <Form onSubmit={handleSymptomSubmit} loading={loading} />
      {diseaseName && <h2>{diseaseName}</h2>}
      {diseaseInfo && <p className="content">{diseaseInfo}</p>}
    </div>
  ); 
};
