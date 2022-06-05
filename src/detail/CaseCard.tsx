import { Card, Divider, Tag, Typography } from "antd";
import React from "react";
import { Md5 } from "ts-md5";
import KVPair from "../components/KVPair";
import { TAG_COLOR } from "../constants/strings";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CaseCard = ({ item }: { item: any }) => (
    <Card title="案件信息" size="small" style={{ margin: "12px" }}>
        <Tag color={TAG_COLOR[parseInt(Md5.hashStr(item.primaryType || "N"), 16) % TAG_COLOR.length]}>
            {item.primaryType || "未知一级类别案件"}
        </Tag>
        <Tag color={TAG_COLOR[parseInt(Md5.hashStr(item.secondaryType || "N"), 16) % TAG_COLOR.length]}>
            {item.secondaryType || "未知二级类别案件"}
        </Tag>
        <Typography style={{ marginTop: "12px" }}>
            {item.year && <KVPair k="案件年份" v={item.year} />}
            {item.courtAlias && <KVPair k="审案法院简称" v={item.courtAlias} />}
            {item.token && <KVPair k="案件字号" v={item.token} />}
            {item.id && <KVPair k="案件顺序号" v={item.id} />}
            {item.name && <Divider />}
            {item.name && <KVPair k="案件案号【全称】" v={item.name} />}
        </Typography>
    </Card>
);


export default CaseCard;