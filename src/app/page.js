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
import {
  Activity,
  Heart,
  Scale,
  Calendar,
  LineChart,
  Calculator,
  HelpCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DiabetesPrediction = () => {
  const [formData, setFormData] = useState({
    glucose: "",
    bmi: "",
    age: "",
    bloodPressure: "",
    diabetesPedigreeFunction: "",
  });

  const [calculators, setCalculators] = useState({
    weight: "",
    height: "",
    familyHistory: {
      parent: false,
      sibling: false,
      grandparent: false,
      aunt_uncle: false,
      cousin: false,
    },
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCalculatorChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setCalculators((prev) => ({
        ...prev,
        familyHistory: {
          ...prev.familyHistory,
          [name]: checked,
        },
      }));
    } else {
      setCalculators((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const calculateBMI = () => {
    const weight = parseFloat(calculators.weight);
    const height = parseFloat(calculators.height);

    if (weight && height) {
      const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);
      setFormData((prev) => ({ ...prev, bmi }));
    }
  };

  const calculatePedigreeScore = () => {
    let score = 0;

    // These weights are simplified for demonstration
    if (calculators.familyHistory.parent) score += 0.5;
    if (calculators.familyHistory.sibling) score += 0.4;
    if (calculators.familyHistory.grandparent) score += 0.3;
    if (calculators.familyHistory.aunt_uncle) score += 0.2;
    if (calculators.familyHistory.cousin) score += 0.1;

    setFormData((prev) => ({
      ...prev,
      diabetesPedigreeFunction: score.toFixed(2),
    }));
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
        "https://diabetes-prediction-model-1-917b.onrender.com/predict",
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
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
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Glucose Level (mg/dL)
                </Label>
                <Input
                  type="number"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  required
                  placeholder="Enter glucose level"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  BMI
                </Label>
                <Input
                  type="number"
                  name="bmi"
                  value={formData.bmi}
                  onChange={handleChange}
                  required
                  placeholder="Use BMI calculator"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Age
                </Label>
                <Input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="Enter age"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Blood Pressure (mm Hg)
                </Label>
                <Input
                  type="number"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  required
                  placeholder="Enter blood pressure"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <LineChart className="w-4 h-4" />
                  Diabetes Pedigree Function
                </Label>
                <Input
                  type="number"
                  name="diabetesPedigreeFunction"
                  value={formData.diabetesPedigreeFunction}
                  onChange={handleChange}
                  required
                  placeholder="Use calculator on the right"
                  step="0.01"
                />
              </div>

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

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              <Calculator className="w-5 h-5 inline-block mr-2" />
              Calculators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* BMI Calculator */}
            <div className="space-y-4">
              <h3 className="font-medium">BMI Calculator</h3>
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  name="weight"
                  value={calculators.weight}
                  onChange={handleCalculatorChange}
                  placeholder="Enter weight in kg"
                />
              </div>
              <div className="space-y-2">
                <Label>Height (cm)</Label>
                <Input
                  type="number"
                  name="height"
                  value={calculators.height}
                  onChange={handleCalculatorChange}
                  placeholder="Enter height in cm"
                />
              </div>
              <Button onClick={calculateBMI} className="w-full">
                Calculate BMI
              </Button>
            </div>

            <Separator />

            {/* Diabetes Pedigree Calculator */}
            <div className="space-y-4">
              <h3 className="font-medium">Family History Calculator</h3>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="parent"
                    checked={calculators.familyHistory.parent}
                    onChange={handleCalculatorChange}
                    className="rounded"
                  />
                  Parent with diabetes
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="sibling"
                    checked={calculators.familyHistory.sibling}
                    onChange={handleCalculatorChange}
                    className="rounded"
                  />
                  Sibling with diabetes
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="grandparent"
                    checked={calculators.familyHistory.grandparent}
                    onChange={handleCalculatorChange}
                    className="rounded"
                  />
                  Grandparent with diabetes
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="aunt_uncle"
                    checked={calculators.familyHistory.aunt_uncle}
                    onChange={handleCalculatorChange}
                    className="rounded"
                  />
                  Aunt/Uncle with diabetes
                </Label>
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="cousin"
                    checked={calculators.familyHistory.cousin}
                    onChange={handleCalculatorChange}
                    className="rounded"
                  />
                  Cousin with diabetes
                </Label>
              </div>
              <Button onClick={calculatePedigreeScore} className="w-full">
                Calculate Pedigree Score
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiabetesPrediction;
