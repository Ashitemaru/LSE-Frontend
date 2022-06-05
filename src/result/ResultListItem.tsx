import { Avatar, Descriptions, List, Skeleton, Space, Tag, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DEFENDANT, INFO_ABSTRACT, NO_DEFENDANT, NO_PROSECUTOR, NO_REPRESENTATIVE, PROSECUTOR, READ_DETAIL, REPRESENTATIVE, UNKNOWN_CASE_NAME, UNKNOWN_COURT_NAME, UNKNOWN_DOCUMENT_NAME, UNKNOWN_PROVINCE } from "../constants/captions";
import { getBackgroundColor } from "./avatarColor";
import { CaseAbstract } from "./type";
import { StarOutlined } from "@ant-design/icons";

const { Paragraph, Text, Title } = Typography;

interface ResultListItemProp {
    item: CaseAbstract,
    refreshing: boolean,
}

const ResultListItem: React.FC<ResultListItemProp> = (props: ResultListItemProp) => {
    const navigate = useNavigate();

    const IconText = ({ icon, text }: { icon: React.FC; text: number }) => (
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
        <Skeleton active loading={props.refreshing} avatar paragraph={{ rows: 1 }}>
            <List.Item
                actions={[
                    <a
                        key="read-more"
                        onClick={() => navigate(`/detail/${props.item.id}`)}>
                        {READ_DETAIL}
                    </a>,
                    <IconText icon={StarOutlined} text={props.item.score} key="list-vertical-star-o" />
                ]}>
                <List.Item.Meta
                    avatar={
                        <Avatar
                            style={{
                                color: "white",
                                background: getBackgroundColor(
                                    props.item.court?.province || "N"
                                )
                            }}>
                            {props.item.court?.province || UNKNOWN_PROVINCE}
                        </Avatar>
                    }
                    title={
                        props.item.court?.name || UNKNOWN_COURT_NAME +
                        `【${props.item.document?.name || UNKNOWN_DOCUMENT_NAME}】`
                    }
                    description={props.item._case?.name || UNKNOWN_CASE_NAME}
                />
                <Descriptions bordered size="small" layout="vertical">
                    <Descriptions.Item label={PROSECUTOR}>
                        {(props.item.persons?.prosecutors || []).length ? (
                            props.item.persons.prosecutors.map((person, ind) => (
                                <Tag key={ind} color="green">{person.name}</Tag>
                            ))
                        ) : NO_PROSECUTOR}
                    </Descriptions.Item>
                    <Descriptions.Item label={DEFENDANT}>
                        {(props.item.persons?.defendants || []).length ? (
                            props.item.persons.defendants.map((person, ind) => (
                                <Tag key={ind} color="red">{person.name}</Tag>
                            ))
                        ) : NO_DEFENDANT}
                    </Descriptions.Item>
                    <Descriptions.Item label={REPRESENTATIVE}>
                        {(props.item.persons?.representatives || []).length ? (
                            props.item.persons.representatives.map((person, ind) => (
                                <Tag key={ind} color="blue">{person.name}</Tag>
                            ))
                        ) : NO_REPRESENTATIVE}
                    </Descriptions.Item>
                </Descriptions>
                <Typography style={{ margin: "12px" }}>
                    <Title level={5}>{INFO_ABSTRACT}</Title>
                    <Paragraph>
                        {getHighlightedText(props.item?.content || "")}
                    </Paragraph>
                </Typography>
            </List.Item>
        </Skeleton >
    );
};

export default ResultListItem;