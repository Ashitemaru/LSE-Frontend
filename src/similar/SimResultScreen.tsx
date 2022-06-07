import { Button, Divider, Input, List, message, Pagination, Spin, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Md5 } from "ts-md5";
import ResultListItem from "../components/ResultListItem";
import { RESULT, UNUNIFIED_TOTAL_RES } from "../constants/captions";
import { BACKEND_URL_PREFIX, TAG_COLOR } from "../constants/strings";
import { uFetch } from "../util/network";
import { CaseAbstract } from "../util/type";

/**
 * @note This component is similar to 'ResultScreen'
 * @todo Make a template of these two components
 */
const SimResultScreen = () => {
    const navigate = useNavigate();

    const resultRef = useRef<[CaseAbstract[], string[]]>([[], []]);
    const [resultStamp, setStamp] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);

    const [total, setTotal] = useState(-1);
    const [pageNum, setPageNum] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(5);

    const [document, setDoc] = useState("");

    const loadResult = () => {
        if (document.length === 0) {
            message.error("搜索关键词不能为空");
            return;
        }

        setRefreshing(true);
        uFetch(BACKEND_URL_PREFIX + "/demo/search/similar", {}, {
            document: document,
            limit: "" + itemPerPage,
            offset: "" + (pageNum * itemPerPage),
        })
            .then((res) => {
                // Check or set the total number of results
                // 'total === -1' means it is the first time to get the result
                if (total === -1) {
                    setTotal(res.count);
                } else if (res.count != total) {
                    message.error(UNUNIFIED_TOTAL_RES);
                    setRefreshing(false);
                    resultRef.current = [[], []];
                    return;
                }

                resultRef.current = [
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    res.hits.map((val: any) => ({
                        ...val,
                        id: parseInt(val.id, 10),
                        score: parseFloat(val.score),
                    }) as CaseAbstract),
                    res.possibleCauses as string[]
                ];

                setStamp(new Date());
                setRefreshing(false);

                console.log(`Similar search result updated at ${resultStamp}.`);
            })
            .catch((err) => {
                message.error(err);
                setRefreshing(false);
            });
    };

    let initialized = false;

    useEffect(() => {
        initialized = true;
    }, []);

    useEffect(() => {
        if (!initialized) {
            loadResult();
        }
    }, [pageNum, itemPerPage]);

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
                    <div>
                        <Divider>{"输入搜索案例"}</Divider>
                        <div style={{ margin: "12px", marginTop: "18px" }}>
                            <Input.TextArea
                                value={document}
                                onChange={(event) => setDoc(event.target.value)}
                                showCount
                                rows={4}
                                placeholder="请在这里输入案例描述"
                                style={{ maxWidth: "40vw" }}
                            />
                            <Button
                                style={{ marginTop: "8px" }}
                                type="primary"
                                onClick={loadResult}>
                                {"搜索"}
                            </Button>
                            <Button
                                style={{ marginTop: "8px", marginLeft: "8px" }}
                                type="ghost"
                                onClick={() => navigate("/")}>
                                {"回到主页"}
                            </Button>    
                        </div>
                        {(resultRef.current[1] || []).length > 0 && <>
                            <Divider>{"高可能性案由"}</Divider>
                            <div style={{ marginLeft: "12px", display: "flex", flexDirection: "row" }}>
                                {resultRef.current[1].map((cause, ind) => (
                                    <div
                                        key={ind}
                                        onClick={() => window.location.href = `/result?cause=${cause}`}>
                                        <Tag
                                            color={
                                                TAG_COLOR[parseInt(Md5.hashStr(cause), 16) % TAG_COLOR.length]
                                            }>
                                            {cause}
                                        </Tag>
                                    </div>
                                ))}
                            </div>
                        </>}
                        <Divider>{RESULT}</Divider>
                        <List
                            itemLayout="vertical"
                            dataSource={resultRef.current[0]}
                            renderItem={(item: CaseAbstract) => (
                                <ResultListItem item={item} />
                            )}
                            style={{
                                margin: "18px",
                            }}
                        />
                        {total > 0 && <Pagination
                            total={total}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(o) => `Total ${o} results`}
                            current={pageNum + 1}
                            pageSize={itemPerPage}
                            onChange={(page, pageSize) => {
                                if (page - 1 != pageNum) {
                                    setPageNum(page - 1);
                                }

                                if (pageSize != itemPerPage) {
                                    setPageNum(0);
                                    setItemPerPage(pageSize);
                                }
                            }}
                            style={{
                                margin: "18px",
                            }}
                            pageSizeOptions={[5, 10, 20]}
                            defaultPageSize={5}
                        />}
                    </div>
                )
            }
        </div>
    );
};

export default SimResultScreen;