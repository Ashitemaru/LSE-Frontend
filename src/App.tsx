import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import { PAGE_FOOTER } from "./constants/strings";
import "antd/dist/antd.css";
import "./css/main.css";
import DetailScreen from "./detail/DetailScreen";
import IntroScreen from "./intro/IntroScreen";
import ResultScreen from "./result/ResultScreen";

const { Footer, Sider, Content } = Layout;

const App: React.FC = () => {
    return (
        <Layout>
            <Sider width={200} className="site-layout-background" theme="dark">
                <div style={{
                    background: "#EEEEEE",
                    margin: "12px",
                    borderRadius: "8px",
                }}>
                    <p style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        alignSelf: "center",
                        textAlign: "center",
                        marginTop: "18px",
                        fontFamily: "consolas",
                    }}>
                            Law Search Engine
                    </p>
                </div>
            </Sider>
            <Layout>
                <Content>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<IntroScreen />} />
                            <Route path="/result" element={<ResultScreen />} />
                            <Route path="/detail/:id" element={<DetailScreen />} />
                        </Routes>
                    </BrowserRouter>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    {PAGE_FOOTER}
                </Footer>
            </Layout>
        </Layout>
    );
};

export default App;
