// backend/models/surveyResponseModel.js
import mongoose from "mongoose";

const surveyResponseSchema = new mongoose.Schema(
    {
        zone: String,
        B1_PostCode: String,
        B4: String,
        B3: String,
        count: Number,
    },
    { collection: "surveyresponses" }
);
export default mongoose.model("SurveyResponse", surveyResponseSchema);
