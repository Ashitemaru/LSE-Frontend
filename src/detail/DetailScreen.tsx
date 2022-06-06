import { Alert, Card, Divider, Empty, List, message, Spin, Tabs, Tag, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Abstract from "../components/Abstract";
import KVPair from "../components/KVPair";
import { FAIL_GET_DETAIL, SUCCESS_GET_DETAIL, UNDEF_URL_PARAM_ID } from "../constants/captions";
import { BACKEND_URL_PREFIX } from "../constants/strings";
import { parseCHNDate } from "../util/date";
import { uFetch } from "../util/network";
import { File, Reference } from "../util/type";
import CaseCard from "./CaseCard";
import CourtCard from "./CourtCard";
import DocumentCard from "./DocumentCard";
import LawReference from "./LawReference";
import PersonList from "./PersonList";
import PrevCard from "./PrevCard";
import RecordBasicCard from "./RecordBasicCard";
import TimelineCard from "./TimelineCard";

const { TabPane } = Tabs;
const { Text, Title } = Typography;

const DetailScreen: React.FC = () => {
    const URLParam = useParams();
    const navigate = useNavigate();

    const detailRef = useRef<File | undefined>(undefined);
    const [detailStamp, setStamp] = useState(new Date());
    const [refreshing, setRefreshing] = useState(true);

    /**
     * @warn Sharing the same problem with ResultScreen,
     * see 'ResultScreen.tsx' for more details.
     */
    let initialized = false;

    useEffect(() => {
        // @warn: Remove it when a better solution is found.
        if (initialized) return;
        else initialized = true;

        if (URLParam.id === undefined) {
            message.error(UNDEF_URL_PARAM_ID);
            navigate("/");
        }

        setRefreshing(true);
        uFetch(
            BACKEND_URL_PREFIX + `/demo/document/${parseInt(URLParam.id as string, 10)}`,
            {}
        )
            .then((res) => {
                console.log(res);

                detailRef.current = res as File;
                setStamp(new Date());
                setRefreshing(false);

                console.log(`File detail updated at ${detailStamp}.`);
                message.success(SUCCESS_GET_DETAIL);
            })
            .catch((err) => {
                message.error(err);
                message.error(FAIL_GET_DETAIL);
                setRefreshing(false);
            });
    }, []);

    /**
     * @note I do not want to store these bunch of CONSTANT STRINGS into 'caption.ts'
     * for there are TOO MANY!
     * @todo Store these strings into 'captions.ts'
     */
    return (
        <div
            className="app-screen"
            style={{
                justifyContent: refreshing ? "center" : undefined
            }}>
            {
                refreshing ? (
                    <Spin tip="Loading..." size="large" />
                ) : (
                    <div style={{ margin: "12px" }}>
                        <List itemLayout="vertical">
                            <Abstract
                                actions={[]}
                                item={detailRef.current}
                                footer={null}
                            />
                        </List>
                        <Tabs type="card" defaultActiveKey="1">
                            <TabPane key={1} tab="基本信息">
                                <div style={{ flexDirection: "column", display: "flex" }}>
                                    <CourtCard item={detailRef.current?.court || {}} />
                                    <DocumentCard item={detailRef.current?.document || {}} />
                                    <CaseCard item={detailRef.current?._case || {}} />
                                </div>
                            </TabPane>
                            <TabPane key={2} tab="涉案各方信息">
                                <div style={{ flexDirection: "column", display: "flex" }}>
                                    {(detailRef.current?.persons?.joinder || false) && <Alert
                                        showIcon
                                        type="info"
                                        message="需要注意，本案为合同诉讼。"
                                        style={{ maxWidth: "30%" }}
                                    />}
                                    <Divider>{"起诉方"}</Divider>
                                    <PersonList
                                        list={detailRef.current?.persons?.prosecutors || []}
                                        isRepresentative={false}
                                    />
                                    <Divider>{"应诉方"}</Divider>
                                    <PersonList
                                        list={detailRef.current?.persons?.defendants || []}
                                        isRepresentative={false}
                                    />
                                    <Divider>{"代理人"}</Divider>
                                    <PersonList
                                        list={detailRef.current?.persons?.representatives || []}
                                        isRepresentative={true}
                                    />
                                </div>
                            </TabPane>
                            <TabPane key={3} tab="诉讼记录">
                                <RecordBasicCard item={detailRef.current?.record || {}} />
                                <Divider>{"诉讼记录"}</Divider>
                                <Typography style={{ marginRight: "12px", marginLeft: "12px" }}>
                                    {detailRef.current?.record?.description
                                        ? <Text>{detailRef.current?.record?.description}</Text>
                                        : <Text type="secondary">{"暂无诉讼记录"}</Text>}
                                </Typography>
                            </TabPane>
                            <TabPane key={4} tab="案件细节">
                                {(detailRef.current?.detail?.references || []).length > 0 && <>
                                    <Divider>{"依据法条"}</Divider>
                                    <LawReference refs={detailRef.current?.detail?.references as Reference[]} />
                                </>}
                                {detailRef.current?.detail?.content && <>
                                    <Divider>{"案件描述与情况"}</Divider>
                                    <Typography style={{ marginRight: "12px", marginLeft: "12px" }}>
                                        <Text>{detailRef.current?.detail?.content}</Text>
                                    </Typography>
                                </>}
                            </TabPane>
                            <TabPane key={5} tab="案件分析与审理结果">
                                {(detailRef.current?.analysis?.references || []).length > 0 && <>
                                    <Divider>{"分析依据法条"}</Divider>
                                    <LawReference refs={detailRef.current?.analysis?.references as Reference[]} />
                                </>}
                                {detailRef.current?.analysis?.content && <>
                                    <Divider>{"裁判分析过程"}</Divider>
                                    <Typography style={{ marginRight: "12px", marginLeft: "12px" }}>
                                        <Text>{detailRef.current?.analysis?.content}</Text>
                                    </Typography>
                                </>}
                                {(detailRef.current?.result?.references || []).length > 0 && <>
                                    <Divider>{"判决依据法条"}</Divider>
                                    <LawReference refs={detailRef.current?.result?.references as Reference[]} />
                                </>}
                                {detailRef.current?.result?.content && <>
                                    <Divider>{"判决结果"}</Divider>
                                    <Typography style={{ marginRight: "12px", marginLeft: "12px" }}>
                                        <Text>{detailRef.current?.result?.content}</Text>
                                    </Typography>
                                </>}
                            </TabPane>
                            <TabPane key={6} tab="案件审理时间线">
                                {detailRef.current?.footer?.date && (
                                    <Card title="本次审理情况" size="small" style={{ margin: "12px" }}>
                                        <Tag color="green">{"已结案"}</Tag>
                                        <Typography style={{ marginTop: "12px" }}>
                                            <KVPair k="结案日期" v={detailRef.current?.footer?.date} />
                                        </Typography>
                                    </Card>
                                )}
                                {(detailRef.current?.record?.prev || []).length > 0 && <>
                                    <Divider>{"前期审理信息"}</Divider>
                                    <List
                                        dataSource={detailRef.current?.record?.prev}
                                        itemLayout="horizontal"
                                        renderItem={(item, ind) => (
                                            <List.Item>
                                                <PrevCard item={item} ind={ind} />
                                            </List.Item>
                                        )}
                                        split={false}
                                    />
                                </>}
                                {(detailRef.current?.timeline || []).length > 0 && <>
                                    <Divider>{"审理流程重要时间节点"}</Divider>
                                    <List
                                        dataSource={
                                            detailRef.current?.timeline
                                                .sort((a, b) => {
                                                    const _a = parseCHNDate(a.date || "");
                                                    const _b = parseCHNDate(b.date || "");
                                                    return (+_b) - (+_a);
                                                })
                                        }
                                        itemLayout="horizontal"
                                        renderItem={(item, ind) => (
                                            <List.Item>
                                                <TimelineCard item={item} ind={ind} />
                                            </List.Item>
                                        )}
                                        split={false}
                                    />
                                </>}
                            </TabPane>
                            <TabPane key={7} tab="裁判人员信息">
                                {(detailRef.current?.footer?.judges || []).length > 0 ? <PersonList
                                    list={detailRef.current?.footer?.judges.map((val) => ({
                                        name: val.name,
                                        status: val.role,
                                        type: val.type,
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    })) as any[]}
                                    isRepresentative={false}
                                /> : <Empty />}
                            </TabPane>
                            <TabPane key={8} tab="文书完整内容">
                                <Typography style={{ marginRight: "12px", marginLeft: "12px" }}>
                                    {detailRef.current?.title && <Title level={4}>
                                        {detailRef.current?.title}
                                    </Title>}
                                    {detailRef.current?.content && <Text>
                                        {detailRef.current?.content}    
                                    </Text>}
                                </Typography>
                            </TabPane>
                        </Tabs>
                    </div >
                )
            }
        </div >
    );
};

export default DetailScreen;