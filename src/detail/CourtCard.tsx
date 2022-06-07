import { Card, Tag, Typography } from "antd";
import React from "react";
import KVPair from "../components/KVPair";

const { Text } = Typography;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CourtCard = ({ item }: { item: any }) => {
    const courtLevelMap: Record<string, number> = {
        "最高": 0,
        "高级": 1,
        "中级": 2,
        "基层": 3,
    };
    const courtLevel = courtLevelMap[(item?.level || "") as string] ?? 4;
    const colorList = ["red", "orange", "green", "blue", "geekblue"];

    return (
        <Card title="法院信息" size="small" style={{ margin: "12px" }}>
            <Tag color={colorList[courtLevel]}>
                {`${item.level || "未知级别"}法院`}
            </Tag>
            <Typography style={{ marginTop: "12px" }}>
                {item.name && <KVPair k="法院名称" v={item.name} />}
                {item.code && <KVPair k="法院代码" v={item.code} />}
                {(item.province !== undefined || item.city !== undefined) && <KVPair
                    k="法院所属城市"
                    v={(() => {
                        switch (courtLevel) {
                        case 0: {
                            return "最高【中央】";
                        }
                        case 1: {
                            return <Text>
                                <Text>{item.province || "未知"}</Text>
                                <Text type="secondary">{" 省/市/自治区"}</Text>
                            </Text>;
                        }
                        default: {
                            return <Text>
                                <Text>{item.province || "未知"}</Text>
                                <Text type="secondary">{" 省/市/自治区 "}</Text>
                                <Text>{item.city || "未知行政区"}</Text>
                            </Text>;
                        }
                        }
                    })()}
                />}
            </Typography>
            {item.name && <a href={`/result?court=${item.name}`}>{"搜索该法院"}</a>}
        </Card>
    );
};

export default CourtCard;