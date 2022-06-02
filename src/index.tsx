import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntroScreen from "./intro/IntroScreen";
import ResultScreen from "./result/ResultScreen";
import { Layout } from "antd";
import { PAGE_FOOTER } from "./constants/strings";
import "antd/dist/antd.css";
import "./css/main.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const { Footer } = Layout;

root.render(
    <React.StrictMode>
        <Layout>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<IntroScreen />} />
                    <Route path="/result" element={<ResultScreen />} />
                </Routes>
            </BrowserRouter>
            <Footer style={{ textAlign: "center" }}>
                {PAGE_FOOTER}
            </Footer>
        </Layout>
    </React.StrictMode>
);
