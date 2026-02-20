import { getRandomPrediction } from '@/services/data';

export async function getPrediction(formData: Record<string, string>) {
    try {
        const response = await fetch('https://ashrafgalibsk-sih-crop-yield-api1.hf.space/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.status}`);
        }

        return await response.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.warn('Prediction API unavailable, using fallback:', error.message);
        return getRandomPrediction();
    }
}
