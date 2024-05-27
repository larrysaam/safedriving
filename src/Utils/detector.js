import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

export const runDetector = async (video) => {
    console.log("Detector")
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
        runtime: "tfjs",
    };
    const detector = await faceLandmarksDetection.createDetector(
        model,
        detectorConfig
    );
    const detect = async (net) => {
        const estimationConfig = { flipHorizontal: false };
        const faces = await net.estimateFaces(video, estimationConfig);
        console.log(faces[0])
        detect(detector);
    };
    detect(detector);
};