import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntroScreen from "./intro/IntroScreen";
import ResultScreen from "./result/ResultScreen";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<IntroScreen />} />
                <Route path="/result" element={<ResultScreen />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
