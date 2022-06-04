import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL_PREFIX } from "../constants/strings";
import { uFetch } from "../util/network";
import { message, Skeleton, Empty } from "antd";
import { NULL_KEYWORD, SEARCH_CAPTION_MID1, SEARCH_CAPTION_MID2, SEARCH_CAPTION_PRE, SEARCH_CAPTION_SUF, UNDEF_URL_PARAM_KEYWORD } from "../constants/captions";
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

    // Parse the URL params
    const URLParam: Record<string, string> = parseURLParam(useLocation().search).result;

    const concatCaption = (keyword: string, time: number, len: number) => (
        SEARCH_CAPTION_PRE + keyword +
        SEARCH_CAPTION_MID1 + time +
        SEARCH_CAPTION_MID2 + len +
        SEARCH_CAPTION_SUF
    );

    /**
     * @warn This is a VERY UGLY solution to deplicated call of useEffect.
     * Remove it when a better solution is found.
     * Even useState cannot handle the problem.
     */
    let called = false;

    useEffect(() => {
        // @warn: Remove it when a better solution is found.
        if (called) return;
        else called = true;

        if (URLParam.keyword === undefined) {
            message.error(UNDEF_URL_PARAM_KEYWORD);
            navigate("/");
        }

        if (URLParam.keyword === "") {
            message.error(NULL_KEYWORD);
            navigate("/");
        }

        setRefreshing(true);
        uFetch(BACKEND_URL_PREFIX + "/demo/search", {
            keyword: URLParam.keyword,
        })
            .then((res) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                resultRef.current = res.hits.map((val: any) => ({
                    id: parseInt(val.id as string, 10),
                    title: val.title,
                    content: val.content,
                }));
                setStamp(new Date());
                setRefreshing(false);

                console.log(`Search result updated at ${resultStamp}.`);
                message.success(concatCaption(
                    decodeURI(URLParam.keyword), res.time, resultRef.current.length
                ));
            })
            .catch((err) => {
                message.error(err);
                setRefreshing(false);
            });
    }, []);

    return (
        <div className="app-screen">
            {refreshing ? (
                <Skeleton active />
            ) : (
                resultRef.current.length ? (
                    <div style={{ flexDirection: "column", display: "flex" }}>
                        {resultRef.current.map((res) => (
                            <div key={res.id}>
                                {res.title}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ alignItems: "center", display: "flex" }}>
                        <Empty />
                    </div>
                )
            )}
        </div>
    );
};

export default ResultScreen;