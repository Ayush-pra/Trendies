import React, { useState } from "react";
import axios from "axios";

const VirtualTryOn = () => {
    const [personImage, setPersonImage] = useState(null);
    const [clothImage, setClothImage] = useState(null);
    const [resultImage, setResultImage] = useState(null);

    const handleSubmit = async () => {
        try {
            const response = await axios.post(
                "http://localhost:3000/api/tryon/virtual",
                { personImage, clothImage },
                { withCredentials: true }
            );
            setResultImage(response.data.result.output_url);
        } catch (error) {
            console.log(error);
        }
    };

    const encodeFile = async (file, callback) => {
        const reader = new FileReader();
        reader.onload = () => callback(reader.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">

            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-xl">

                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Virtual Try-On
                </h1>

                <label className="block text-gray-700 font-medium mb-2">Your Photo</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => encodeFile(e.target.files[0], setPersonImage)}
                    className="w-full mb-4 border rounded-lg p-2"
                />

                <label className="block text-gray-700 font-medium mb-2">Garment Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => encodeFile(e.target.files[0], setClothImage)}
                    className="w-full mb-4 border rounded-lg p-2"
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
                >
                    Try Now
                </button>

                {resultImage && (
                    <div className="mt-6 text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Result</h3>
                        <img src={resultImage} className="mx-auto rounded-lg shadow-lg" width={300} />
                    </div>
                )}

            </div>
        </div>
    );
};

export default VirtualTryOn;
