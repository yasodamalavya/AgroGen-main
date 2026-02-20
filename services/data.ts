export interface CropYieldPrediction {
  model: string;
  predicted_yield: string;
  total_expected_production: string;
  assessment: string;
}

const dummyPredictions: CropYieldPrediction[] = [
  {
    model: 'Random Forest',
    predicted_yield: '2017.7 kg/hectare',
    total_expected_production: '20.18 tons',
    assessment: 'Good yield expected',
  },
  {
    model: 'Gradient Boosting',
    predicted_yield: '1850.3 kg/hectare',
    total_expected_production: '18.50 tons',
    assessment: 'Moderate yield expected',
  },
  {
    model: 'XGBoost',
    predicted_yield: '2200.5 kg/hectare',
    total_expected_production: '22.01 tons',
    assessment: 'Excellent yield expected',
  },
  {
    model: 'Linear Regression',
    predicted_yield: '1750.0 kg/hectare',
    total_expected_production: '17.50 tons',
    assessment: 'Average yield expected',
  },
  {
    model: 'Decision Tree',
    predicted_yield: '1900.8 kg/hectare',
    total_expected_production: '19.01 tons',
    assessment: 'Stable yield expected',
  },
];

export const getRandomPrediction = (): CropYieldPrediction => {
  const randomIndex = Math.floor(Math.random() * dummyPredictions.length);
  return dummyPredictions[randomIndex];
};