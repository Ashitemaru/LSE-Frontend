import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL_PREFIX } from "../constants/strings";
import { uFetch } from "../util/network";
import { message, Skeleton, Empty, Button, Pagination } from "antd";
import {
    NULL_KEYWORD,
    SEARCH_CAPTION_MID1,
    SEARCH_CAPTION_MID2,
    SEARCH_CAPTION_PRE,
    SEARCH_CAPTION_SUF,
    UNDEF_URL_PARAM_KEYWORD,
    UNUNIFIED_TOTAL_RES
} from "../constants/captions";
import { parseURLParam } from "../util/url";

interface SearchResult {
    id: number,
    title: string,
    content: string,
}

const ResultScreen: React.FC = () => {
    const navigate = useNavigate();

    const resultRef = useRef<SearchResult[]>([]);
    const [resultStamp, setStamp] = useState(new Date());

    const [refreshing, setRefreshing] = useState(true);
    const [shouldForceRefresh, setForceRefresh] = useState(false);

    const [total, setTotal] = useState(-1);
    const [pageNum, setPageNum] = useState(0);
    const [itemPerPage, setItemPerPage] = useState(10);

    // Parse the URL params
    const URLParam: Record<string, string> = parseURLParam(useLocation().search).result;

    const concatCaption = (keyword: string, time: number, len: number) => (
        SEARCH_CAPTION_PRE + keyword +
        SEARCH_CAPTION_MID1 + time +
        SEARCH_CAPTION_MID2 + len +
        SEARCH_CAPTION_SUF
    );

    const loadResult = () => {
        setRefreshing(true);
        uFetch(BACKEND_URL_PREFIX + "/demo/search", {
            keyword: URLParam.keyword,
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
                    setForceRefresh(true); // Force user to refresh the page
                    setRefreshing(false);
                    resultRef.current = [];
                    return;
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                resultRef.current = res.hits.map((val: any) => ({
                    id: parseInt(val.id as string, 10),
                    title: val.id,
                    content: val.content,
                }));

                setStamp(new Date());
                setRefreshing(false);

                console.log(`Search result updated at ${resultStamp}.`);
                message.success(concatCaption(decodeURI(URLParam.keyword), res.time, res.count));
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

        if (URLParam.keyword === undefined) {
            message.error(UNDEF_URL_PARAM_KEYWORD);
            navigate("/");
        }

        if (URLParam.keyword === "") {
            message.error(NULL_KEYWORD);
            navigate("/");
        }

        resultRef.current = [];
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
        <div className="app-screen">
            {refreshing ? (
                <Skeleton active />
            ) : (
                shouldForceRefresh || resultRef.current.length === 0 ? (
                    <Empty />
                ) : (
                    <div style={{ flexDirection: "column", display: "flex" }}>
                        {resultRef.current.map((res) => (
                            <div key={res.id}>{res.title}</div>
                        ))}
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
                        />
                    </div>
                )
            )}
        </div>
    );
};

export default ResultScreen;