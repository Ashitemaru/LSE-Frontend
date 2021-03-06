import { Space, Typography } from "antd";
import React from "react";
import { INFO_ABSTRACT, NULL_ABSTRACT, READ_DETAIL } from "../constants/captions";
import { StarOutlined } from "@ant-design/icons";
import Abstract from "./Abstract";

const { Paragraph, Text, Title } = Typography;

interface ResultListItemProp {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    footer?: any,
}

const ResultListItem: React.FC<ResultListItemProp> = (props: ResultListItemProp) => {
    const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const getHighlightedText = (text: string) => {
        const base = text.split("<em>");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const components: any[] = [];

        base.forEach((val, ind) => {
            if (ind === 0) {
                components.push(val);
                return;
            }

            const [mid, suf] = val.split("</em>");
            components.push(<Text mark key={ind}>{mid}</Text>);
            components.push(suf);
        });

        return components;
    };

    return (
        <Abstract
            actions={[
                <a
                    key="read-more"
                    onClick={() => window.open(`/detail/${props.item.id}`, "_blank")}>
                    {READ_DETAIL}
                </a>,
                <IconText
                    icon={StarOutlined}
                    text={(props.item.score === undefined || Number.isNaN(props.item.score))
                        ? "相似度评分不适用"
                        : ("" + props.item.score)}
                    key="list-vertical-star-o"
                />
            ]}
            item={props.item}
            footer={(
                <>
                    <Typography style={{ margin: "12px" }}>
                        <Title level={5}>{INFO_ABSTRACT}</Title>
                        <Paragraph>
                            {getHighlightedText(props.item?.content || NULL_ABSTRACT)}
                        </Paragraph>
                    </Typography>
                    {props.footer}
                </>
            )}
            style={{ margin: "12px" }}
        />
    );
};

export default ResultListItem;