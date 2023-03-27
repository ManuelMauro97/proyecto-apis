import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export const Form = ({ onSubmit, loading }) => {
  const [symptoms, setSymptoms] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(symptoms.split(","));
  };

  const handleSymptomsChange = (e) => {
    setSymptoms(e.target.value);
  };

  return (
    <Stack alignItems={"center"} justifyContent={"center"} alignContent={"center"}>
      <h3>Busca tu enfermedad</h3>
      <form onSubmit={handleSubmit}>
        <Stack direction="column" spacing={2}>
          <TextField
            label="Ingresa tus síntomas"
            id="symptoms"
            name="symptoms"
            value={symptoms}
            onChange={handleSymptomsChange}
            required
          />
          <Button type="submit" disabled={loading}>
            Buscar enfermedad
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};


