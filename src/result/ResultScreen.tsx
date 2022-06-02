import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BACKEND_URL_PREFIX } from "../constants/strings";
import { uFetch } from "../util/network";
import { message } from "antd";
import { NULL_URL_PARAM_KEYWORD } from "../constants/captions";
import { parseURLParam } from "../util/url";

interface SearchResult {
    title: string,
    content: string,
}

const ResultScreen: React.FC = () => {
    const navigate = useNavigate();
    const [result, setResult] = useState<SearchResult[]>([]);
    const [refreshing, setRefreshing] = useState(true);

    // Parse the URL params
    const URLParam: Record<string, string> = parseURLParam(useLocation().search).result;

    useEffect(() => {
        if (URLParam.keyword === undefined) {
            message.error(NULL_URL_PARAM_KEYWORD);
            navigate("/");
        }

        setRefreshing(true);
        uFetch(BACKEND_URL_PREFIX + "/demo/search", {
            keyword: URLParam.keyword,
        })
            .then((res) => {
                console.log(
                    `Searching by keyword ${URLParam.keyword} takes ${res.time} s.`
                );
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setResult(res.hits.map((val: any) => ({
                    title: val.title,
                    content: val.content,
                })));
                setRefreshing(false);
            })
            .catch((err) => {
                message.error(err);
                setRefreshing(false);
            });
    }, []);

    return (
        <div className="app-screen">
            Result!
        </div>
    );
};

export default ResultScreen;