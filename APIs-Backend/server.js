import { xml2json } from "xml-js";
import util from "util";
import express from "express";
import cors from "cors";
import openaiHandler from "./openaiHandler.js";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/diagnose", async (req, res) => {
  const symptoms = req.body.symptoms;

  try {
    const disease = await openaiHandler(symptoms);
    res.json({ disease });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al comunicarse con la API de OpenAI" });
  }
});

app.get("/api/disease-info/:disease", async (req, res) => {
  const disease = req.params.disease;

  try {
    const summary = await getDiseaseInfo(disease);
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al comunicarse con la API de MedlinePlus" });
  }
});

async function getDiseaseInfo(disease) {
  console.log("Getting disease info for:", disease);
  const medlinePlusUrl = `https://wsearch.nlm.nih.gov/ws/query?db=healthTopicsSpanish&term=full-summary:${encodeURIComponent(
    disease
  )}&retmax=1`;

  // try {
  //   const response = await axios.get(medlinePlusUrl);
  //   const parsedResponse = xml2json(response.data)
  //   console.log(parsedResponse)

  //   return parsedResponse;

    try {
      const response = await axios.get(medlinePlusUrl);
      const xmlData = response.data;
      console.log(xmlData);
  
      return xmlData;


    // const parseString = util.promisify(parser.parseString);
    // const xmlDoc = await parseString(xmlString);

    // if (!xmlDoc.feed || !xmlDoc.feed.entry) {
    //   return "No se encontró información para esta enfermedad.";
    // }
  
    // const summaryNode = xmlDoc.feed.entry[0]?.summary[0];
    // const fullSummaryNode = xmlDoc.feed.entry[0]?.content.find(
    //   (content) => content.$.name === "FullSummary"
    // );
  
    // const summary = fullSummaryNode
    //   ? fullSummaryNode._.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    //   : summaryNode
    //   ? summaryNode
    //   : "No se encontró un resumen para esta enfermedad.";
  
    // return summary;
  } catch (error) {
    console.error(error);
    return null;
  }
}




const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

