import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Avatar, Layout } from "antd";
import { PAGE_FOOTER } from "./constants/strings";
import "antd/dist/antd.css";
import "./css/main.css";
import DetailScreen from "./detail/DetailScreen";
import IntroScreen from "./intro/IntroScreen";
import ResultScreen from "./result/ResultScreen";
import SimResultScreen from "./similar/SimResultScreen";
import { MediumOutlined } from "@ant-design/icons";

const { Footer, Sider, Content } = Layout;

const App: React.FC = () => {
    return (
        <Layout>
            <Sider width={200} className="site-layout-background" theme="light">
                <div style={{
                    margin: "12px",
                    borderRadius: "8px",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "120px",
                    display: "flex"
                }}>
                    <Avatar size={80} icon={<MediumOutlined />} style={{ color: "#f56a00", backgroundColor: "#fde3cf" }}></Avatar>
                </div>
            </Sider>
            <Layout>
                <Content>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<IntroScreen />} />
                            <Route path="/result" element={<ResultScreen />} />
                            <Route path="/similar" element={<SimResultScreen />} />
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
