import { Card, Tag, Typography } from "antd";
import React from "react";
import { Md5 } from "ts-md5";
import KVPair from "../components/KVPair";
import { TAG_COLOR } from "../constants/strings";
import { Prev } from "../util/type";

const PrevCard = ({ item, ind }: { item: Prev, ind: number }) => (
    <Card
        title={`前期审理【${ind + 1}】`}
        size="small">
        <Tag
            color={
                TAG_COLOR[
                    parseInt(Md5.hashStr(item.prevStage || "N"), 16) % TAG_COLOR.length
                ]
            }>
            {(item.prevStage || "未知") + "案件"}
        </Tag>
        <Typography style={{ marginTop: "12px" }}>
            {item.prevName && <KVPair k="前审案号" v={item.prevName} />}
            {item.prevCourt && <KVPair k="前审法院" v={item.prevCourt} />}
            {item.prevType && <KVPair k="前审文书种类" v={item.prevType} />}
            {item.prevCause && <KVPair k="前审案由" v={item.prevCause} />}
            {item.prevResult && <KVPair k="前审判决结果" v={item.prevResult} />}
            {item.prevDate && <KVPair k="前审日期" v={item.prevDate} />}
        </Typography>
    </Card>
);

export default PrevCard;