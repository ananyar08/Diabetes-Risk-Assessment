"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, Heart, Scale, Calendar, LineChart } from "lucide-react";

const DiabetesPrediction = () => {
  const [formData, setFormData] = useState({
    glucose: "",
    bmi: "",
    age: "",
    bloodPressure: "",
    diabetesPedigreeFunction: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const processedData = {
      Glucose: parseFloat(formData.glucose),
      BMI: parseFloat(formData.bmi),
      Age: parseInt(formData.age),
      BloodPressure: parseFloat(formData.bloodPressure),
      DiabetesPedigreeFunction: parseFloat(formData.diabetesPedigreeFunction),
    };

    try {
      const response = await fetch(
        "https://diabetes-prediction-model1.onrender.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(processedData),
        }
      );

      const data = await response.json();
      setResult(data.diabetes_prediction ? "Diabetic" : "Non-Diabetic");
    } catch (error) {
      console.error("Error:", error);
      setResult("Error occurred while predicting.");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    {
      name: "glucose",
      label: "Glucose Level",
      icon: <Activity className="w-4 h-4" />,
      step: "1",
    },
    {
      name: "bmi",
      label: "BMI",
      icon: <Scale className="w-4 h-4" />,
      step: "0.1",
    },
    {
      name: "age",
      label: "Age",
      icon: <Calendar className="w-4 h-4" />,
      step: "1",
    },
    {
      name: "bloodPressure",
      label: "Blood Pressure",
      icon: <Heart className="w-4 h-4" />,
      step: "1",
    },
    {
      name: "diabetesPedigreeFunction",
      label: "Diabetes Pedigree Function",
      icon: <LineChart className="w-4 h-4" />,
      step: "0.01",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Diabetes Risk Assessment
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your health metrics below for a prediction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {inputFields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  {field.icon}
                  {field.label}
                </Label>
                <Input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  step={field.step}
                  required
                  className="block w-full rounded-md"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Predict Risk"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          {result && (
            <Alert
              className={`w-full ${
                result === "Diabetic" ? "bg-red-50" : "bg-green-50"
              }`}
            >
              <AlertDescription
                className={`text-center font-medium ${
                  result === "Diabetic" ? "text-red-800" : "text-green-800"
                }`}
              >
                Prediction Result: {result}
              </AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default DiabetesPrediction;
