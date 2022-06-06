import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL_PREFIX } from "../constants/strings";
import { uFetch } from "../util/network";
import { message, Pagination, List, Spin, Divider, Input, Dropdown, Menu, Tag, Typography } from "antd";
import {
    NULL_KEYWORD,
    RESULT,
    UNUNIFIED_TOTAL_RES
} from "../constants/captions";
import { parseURLParam } from "../util/url";
import ResultListItem from "./ResultListItem";
import { CaseAbstract } from "./type";

const { Search } = Input;
const { Text } = Typography;

interface SearchSuggest {
    keyword: string,
    type: "court" | "judge" | "cause",
}

enum SearchType {
    KEYWORD = 0, // 关键词查找
    SIMILAR = 1, // 类案查找
    ADVANCED = 2, // 高级查找
}

const ResultScreen: React.FC = () => {
    const navigate = useNavigate();

    const resultRef = useRef<CaseAbstract[]>([]);
    const [resultStamp, setStamp] = useState(new Date());

    const suggestRef = useRef<SearchSuggest[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [suggestStamp, setSuggestStamp] = useState(new Date());
    const [dropDownVisible, setVisible] = useState(false);

    const [refreshing, setRefreshing] = useState(true);

    const [total, setTotal] = useState(-1);
    const [pageNum, setPageNum] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(5);

    const advancedKeyList = [
        "province", "city", "court", "type", "name", "year",
        "cause", "person", "judge", "reference"
    ];

    // Parse the URL params
    const URLParam: Record<string, string> = parseURLParam(useLocation().search).result;

    const translateSuggestType = (type: "court" | "judge" | "cause") => {
        if (type === "cause") return "案由";
        else if (type === "court") return "法院";
        else return "法官";
    };

    const getSuggestTypeColor = (type: "court" | "judge" | "cause") => {
        if (type === "cause") return "red";
        else if (type === "court") return "blue";
        else return "green";
    };

    const loadResult = () => {
        let type = SearchType.KEYWORD;
        if (!(URLParam.keyword && URLParam.keyword !== "")) {
            let keyFound = false;
            for (const key of advancedKeyList) {
                if (URLParam[key] && URLParam[key] !== "") {
                    keyFound = true;
                    break;
                }
            }

            if (keyFound) type = SearchType.ADVANCED;
            else {
                message.error("URL 参数不合法，请重试");
                navigate("/");
                return;
            }
        }

        // Clear
        resultRef.current = [];
        suggestRef.current = [];

        const suffixList = ["/demo/search", "/demo/search/similar", "/demo/search/advanced"];

        const param: Record<string, string> = {
            limit: "" + itemPerPage,
            offset: "" + (pageNum * itemPerPage),
        };
        if (type === SearchType.KEYWORD) {
            param.keyword = URLParam.keyword;
        } else if (type === SearchType.ADVANCED) {
            advancedKeyList.forEach((key) => param[key] = URLParam[key]);
        }

        setRefreshing(true);
        uFetch(BACKEND_URL_PREFIX + suffixList[type], param)
            .then((res) => {
                // Check or set the total number of results
                // 'total === -1' means it is the first time to get the result
                if (total === -1) {
                    setTotal(res.count);
                } else if (res.count != total) {
                    message.error(UNUNIFIED_TOTAL_RES);
                    setRefreshing(false);
                    resultRef.current = [];
                    return;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                resultRef.current = res.hits.map((val: any) => ({
                    ...val,
                    id: parseInt(val.id, 10),
                    score: parseFloat(val.score),
                }) as CaseAbstract);

                setStamp(new Date());
                setRefreshing(false);

                console.log(`Search result updated at ${resultStamp}.`);
            })
            .catch((err) => {
                message.error(err);
                setRefreshing(false);
            });
    };

    /**
     * @warn This is a VERY UGLY solution to duplicated call of useEffect.
     * Remove it when a better solution is found.
     * Even useState cannot handle the problem.
     */
    let initialized = false;

    useEffect(() => {
        // @warn: Remove it when a better solution is found.
        if (initialized) return;
        else initialized = true;

        loadResult();
    }, []);

    /**
     * @warn This 'useEffect' must be placed behind the effect hook whose depList is [].
     * This placement ensures that the 'initialized' variable is correctly set to 'true'
     * and the this effect will not be executed.
     * Remove it when a better solution is found.
     */
    useEffect(() => {
        /**
         * @note When initializing the page, the previous 'useEffect' has loaded the data
         * & 'initialized' variable has been set to 'true', so we do not need to load data again here.
         * When updating the page, the previous 'useEffect' will not be executed,
         * & 'initialized' variable will be 'false' and we need to refresh data here.
         */
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
                        <div
                            onFocus={() => setVisible(true)}
                            onBlur={() => setVisible(false)}>
                            <Dropdown
                                overlay={<Menu
                                    items={
                                        suggestRef.current.length ? (
                                            suggestRef.current
                                                .filter((_, ind) => ind < 10)
                                                .map((sug, ind) => ({
                                                    key: ind,
                                                    label: <div
                                                        onClick={() => {
                                                            window.location.href = `/result?${sug.type}=${sug.keyword}`;
                                                        }}
                                                        style={{ display: "flex" }}>
                                                        <Tag
                                                            color={getSuggestTypeColor(sug.type)}
                                                            style={{ marginRight: "8px" }}>
                                                            {translateSuggestType(sug.type)}
                                                        </Tag>
                                                        <Text>{sug.keyword}</Text>
                                                    </div>
                                                }))
                                                .concat([{
                                                    key: 10,
                                                    label: <Text type="secondary">
                                                        {"点击上方各推荐项将会使用高级搜索而非关键词搜索"}
                                                    </Text>
                                                }])
                                        ) : ([{
                                            key: 0,
                                            label: <Text type="secondary">{"暂无搜索推荐"}</Text>
                                        }])
                                    }
                                />}
                                visible={dropDownVisible}>
                                <Search
                                    enterButton
                                    onSearch={(keyword: string) => {
                                        if (keyword === "") {
                                            message.error(NULL_KEYWORD);
                                            return;
                                        }
                                        
                                        // We reset the href instead of using navigate to force refresh the page
                                        window.location.href = `/result?keyword=${keyword}`;
                                    }}
                                    style={{
                                        height: "20px",
                                        width: "50vw",
                                        margin: "12px",
                                    }}
                                    onChange={(event) => {
                                        uFetch(BACKEND_URL_PREFIX + "/demo/search/suggest", {
                                            keyword: event.target.value,
                                        })
                                            .then((res) => {
                                                if (res.keyword !== event.target.value) return;

                                                suggestRef.current = res.suggest as SearchSuggest[];
                                                setSuggestStamp(new Date());
                                            })
                                            .catch(message.error);
                                    }}
                                />
                            </Dropdown>
                        </div>
                        <Divider>{RESULT}</Divider>
                        <List
                            itemLayout="vertical"
                            dataSource={resultRef.current}
                            renderItem={(item: CaseAbstract) => (
                                <ResultListItem item={item} />
                            )}
                            style={{
                                margin: "18px",
                            }}
                        />
                        <Pagination
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
                        />
                    </div>
                )
            }
        </div>
    );
};

export default ResultScreen;