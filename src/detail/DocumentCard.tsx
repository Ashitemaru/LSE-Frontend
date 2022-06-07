import { Card, Tag, Typography } from "antd";
import React from "react";
import { Md5 } from "ts-md5";
import KVPair from "../components/KVPair";
import { TAG_COLOR } from "../constants/strings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DocumentCard = ({ item }: { item: any }) => (
    <Card title="文书信息" size="small" style={{ margin: "12px" }}>
        <Tag color={TAG_COLOR[parseInt(Md5.hashStr(item.type || "N"), 16) % TAG_COLOR.length]}>
            {item.type || "未知类别文书"}
        </Tag>
        <Typography style={{ marginTop: "12px" }}>
            {item.name && <KVPair k="文书详细类型" v={item.name} />}
        </Typography>
        {item.type && <a href={`/result?type=${item.type}`}>{"搜索该文书类型"}</a>}
    </Card>
);

export default DocumentCard;