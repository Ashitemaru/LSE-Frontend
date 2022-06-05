import { Alert, Divider, List, message, Spin, Tabs } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Abstract from "../components/Abstract";
import { FAIL_GET_DETAIL, SUCCESS_GET_DETAIL, UNDEF_URL_PARAM_ID } from "../constants/captions";
import { BACKEND_URL_PREFIX } from "../constants/strings";
import { uFetch } from "../util/network";
import { File } from "../util/type";
import CaseCard from "./CaseCard";
import CourtCard from "./CourtCard";
import DocumentCard from "./DocumentCard";
import PersonList from "./PersonList";

const { TabPane } = Tabs;

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
                        <Tabs type="card" defaultActiveKey="3">
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
                                121121121
                            </TabPane>
                        </Tabs >
                    </div >
                )
            }
        </div >
    );
};

export default DetailScreen;