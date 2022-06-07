import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Divider, Input, List, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "../css/main.css";
import { NULL_KEYWORD } from "../constants/captions";
import { uFetch } from "../util/network";
import { BACKEND_URL_PREFIX } from "../constants/strings";

const { Search } = Input;
const { Text } = Typography;

const IntroScreen: React.FC = () => {
    const navigate = useNavigate();

    const causeListRef = useRef<string[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [causeStamp, setStamp] = useState(new Date());

    let initialized = false;

    useEffect(() => {
        if (initialized) return;
        else initialized = true;

        uFetch(BACKEND_URL_PREFIX + "/demo/hot/cause", {
            threshold: "" + 5,
        })
            .then((res) => {
                console.log(res);
                
                causeListRef.current = res.data as string[];
                setStamp(new Date());
            })
            .catch(message.error);
    }, []);

    return (
        <div className="app-screen" style={{
            justifyContent: "center",
            alignItems: "center",
        }}>
            <div style={{ width: "40vw" }}>
                <Search
                    placeholder="请输入查询关键词"
                    enterButton
                    onSearch={(keyword: string) => {
                        if (keyword === "") {
                            message.error(NULL_KEYWORD);
                            return;
                        }
                        navigate(`/result?keyword=${keyword}`);
                    }}
                />
                <Button
                    style={{ marginTop: "12px" }}
                    onClick={() => window.location.href = "/similar"}
                    type="dashed">
                    {"切换到类案搜索"}
                </Button>
            </div>
            <Divider>{"今日热点案由"}</Divider>
            <div style={{ width: "25vw" }}>
                <List
                    dataSource={causeListRef.current}
                    renderItem={(cause, ind) => <List.Item
                        onClick={() => {
                            window.location.href = `/result?cause=${cause}`;
                        }}>
                        <List.Item.Meta
                            avatar={<Avatar
                                style={{
                                    color: ((n) => {
                                        if (n === 1) return "#DAA520";
                                        else if (n === 2) return "#808080";
                                        else if (n === 3) return "#802A2A";
                                        else return "gray";
                                    })(ind + 1),
                                    background: ((n) => {
                                        if (n === 1) return "gold";
                                        else if (n === 2) return "silver";
                                        else if (n === 3) return "#BA6E40";
                                        else return "lightgray";
                                    })(ind + 1),
                                    marginRight: "8px",
                                    marginBottom: "8px",
                                    fontWeight: "bold",
                                }}>
                                {ind + 1}
                            </Avatar>}
                        />
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Text>
                                {cause}
                            </Text>
                        </div>
                    </List.Item>}
                    locale={{ emptyText: <Text type="secondary">{"暂无搜索推荐"}</Text> }}
                />
            </div>
        </div>
    );
};

export default IntroScreen;