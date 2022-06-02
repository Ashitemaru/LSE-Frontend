import React from "react";
import { Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import "../css/main.css";
import { NULL_KEYWORD } from "../constants/captions";

const { Search } = Input;

const IntroScreen: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="app-screen" style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
        }}>
            Welcome to LSE!
            <Search
                placeholder="Input keyword to search"
                enterButton
                onSearch={(keyword: string) => {
                    if (keyword === "") {
                        message.error(NULL_KEYWORD);
                        return;
                    }
                    navigate(`/result?keyword=${keyword}`);
                }}
            />
        </div>
    );
};

export default IntroScreen;