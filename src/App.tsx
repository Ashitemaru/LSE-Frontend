import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Avatar, Image, Layout, Typography } from "antd";
import { ICON_URL, PAGE_FOOTER } from "./constants/strings";
import "antd/dist/antd.css";
import "./css/main.css";
import DetailScreen from "./detail/DetailScreen";
import IntroScreen from "./intro/IntroScreen";
import ResultScreen from "./result/ResultScreen";
import SimResultScreen from "./similar/SimResultScreen";

const { Footer, Sider, Content } = Layout;

const App: React.FC = () => {
    return (
        <Layout>
            <Sider width={200} className="site-layout-background" theme="dark">
                <div style={{
                    margin: "12px",
                    marginTop: "48px",
                    borderRadius: "8px",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <Avatar size={100} src={<Image src={ICON_URL} />} />
                    <Typography style={{ marginTop: "12px" }}>
                        <Typography.Title level={4} style={{ color: "white" }}>
                            {"Kiritan Law SE"}
                        </Typography.Title>
                        <Typography.Text style={{ color: "#DDDDDD" }}>
                            {"UNIDY & Ashitemaru"}
                        </Typography.Text>
                    </Typography>
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
