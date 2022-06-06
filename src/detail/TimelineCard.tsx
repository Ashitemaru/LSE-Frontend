import { Card, Tag, Typography } from "antd";
import React from "react";
import { Md5 } from "ts-md5";
import KVPair from "../components/KVPair";
import { TAG_COLOR } from "../constants/strings";
import { Event } from "../util/type";

const { Text } = Typography;

const TimelineCard = ({ item, ind }: { item: Event, ind: number }) => (
    <Card
        title={`时间节点【${ind + 1}】`}
        size="small">
        <Tag
            color={
                TAG_COLOR[
                    parseInt(Md5.hashStr(item.origin || "N"), 16) % TAG_COLOR.length
                ]
            }>
            {item.origin || "未知来源"}
        </Tag>
        <Typography style={{ marginTop: "12px" }}>
            {item.date && <KVPair k="具体时间" v={item.date} />}
            {item.content && <Text>{item.content}</Text>}
        </Typography>
    </Card>
);

export default TimelineCard;