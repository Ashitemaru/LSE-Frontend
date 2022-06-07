import { Card, Divider, Tag, Typography } from "antd";
import React from "react";
import KVPair from "../components/KVPair";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RecordBasicCard = ({ item }: { item: any }) => (
    <Card title="诉讼基本信息" size="small" style={{ margin: "12px" }}>
        {item.court !== undefined && <Tag color={item.court ? "green" : "red"}>
            {item.court ? "已开庭审理" : "未开庭审理"}
        </Tag>}
        {item.juvenile === true && <Tag color="green">{"少年法庭"}</Tag>}
        {item.single !== undefined && <Tag color={item.single ? "green" : "red"}>
            {item.single ? "独任审判" : "非独任审判"}
        </Tag>}
        {item.convert !== undefined && <Tag color={item.convert ? "green" : "red"}>
            {item.convert ? "简易转普通案件" : "非简易转普通案件"}
        </Tag>}
        {item.changeProcedure !== undefined && <Tag color={item.changeProcedure ? "green" : "red"}>
            {item.changeProcedure ? "适用变更程序" : "不适用变更程序"}
        </Tag>}
        <Typography style={{ marginTop: "12px" }}>
            {item.type && <KVPair k="诉讼性质" v={item.type} />}
            {item.cause && <KVPair k="案由" v={item.cause} />}
            {item.courtInfo && <KVPair k="开庭审理信息" v={item.courtInfo} />}
            {item.courtDate && <KVPair k="开庭审理日期" v={item.courtDate} />}
            {item.suitDate && <KVPair k="起诉日期" v={item.suitDate} />}
            {item.acceptDate && <KVPair k="受理日期" v={item.acceptDate} />}
            {item.tribunal && <KVPair k="审判组织" v={item.tribunal} />}
        </Typography>
        {item.cause && <a href={`/result?cause=${item.cause}`}>{"搜索该案由"}</a>}
        <Divider />
        {(() => {
            if (item.stage === 1) {
                return <>
                    <Tag color="blue">{"一审案件"}</Tag>
                    <Typography style={{ marginTop: "12px" }}>
                        {item.source && <KVPair k="一审案件来源" v={item.source} />}
                        {item.procedure && <KVPair k="一审案件适用程序" v={item.procedure} />}
                    </Typography>
                </>;
            } else if (item.stage === 2) {
                return <>
                    <Tag color="green">{"二审案件"}</Tag>
                    <Typography style={{ marginTop: "12px" }}>
                        {item.source && <KVPair k="二审案件来源" v={item.source} />}
                    </Typography>
                </>;
            } else {
                return null;
            }
        })()}
    </Card>
);

export default RecordBasicCard;