import { Avatar, Descriptions, List, Tag } from "antd";
import React from "react";
import { DEFENDANT, NO_DEFENDANT, NO_PROSECUTOR, NO_REPRESENTATIVE, PROSECUTOR, REPRESENTATIVE, UNKNOWN_CASE_NAME, UNKNOWN_COURT_NAME, UNKNOWN_DOCUMENT_NAME, UNKNOWN_NAME, UNKNOWN_PROVINCE } from "../constants/captions";
import { getBackgroundColor } from "../util/avatarColor";

interface AbstractProps {
    actions: JSX.Element[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: any,
    footer: JSX.Element | null,
}

/**
 * @note Remember to wrap it in <List>.
 */
const Abstract: React.FC<AbstractProps> = (props: AbstractProps) => (
    <List.Item actions={props.actions} style={props.style}>
        <List.Item.Meta
            avatar={
                <div onClick={() => window.location.href = `/result?province=${props.item?.court?.province}`}>
                    <Avatar
                        style={{
                            color: "white",
                            background: getBackgroundColor(
                                props.item?.court?.province || "N"
                            )
                        }}>
                        {props.item?.court?.province || UNKNOWN_PROVINCE}
                    </Avatar>
                </div>
            }
            title={
                (props.item?.court?.name || UNKNOWN_COURT_NAME) +
                    `【${props.item?.document?.name || UNKNOWN_DOCUMENT_NAME}】`
            }
            description={props.item?._case?.name || UNKNOWN_CASE_NAME}
        />
        <Descriptions bordered size="small" layout="vertical">
            <Descriptions.Item label={PROSECUTOR}>
                {(props.item?.persons?.prosecutors || []).length ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    props.item?.persons?.prosecutors.map((person: any, ind: number) => (
                        <Tag
                            key={ind}
                            color="green"
                            onClick={() => window.location.href = `/result?person=${person?.name}`}>
                            {person?.name || UNKNOWN_NAME}
                        </Tag>
                    ))
                ) : NO_PROSECUTOR}
            </Descriptions.Item>
            <Descriptions.Item label={DEFENDANT}>
                {(props.item?.persons?.defendants || []).length ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    props.item?.persons?.defendants.map((person: any, ind: number) => (
                        <Tag
                            key={ind}
                            color="red"
                            onClick={() => window.location.href = `/result?person=${person?.name}`}>
                            {person?.name || UNKNOWN_NAME}
                        </Tag>
                    ))
                ) : NO_DEFENDANT}
            </Descriptions.Item>
            <Descriptions.Item label={REPRESENTATIVE}>
                {(props.item?.persons?.representatives || []).length ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    props.item?.persons?.representatives.map((person: any, ind: number) => (
                        <Tag
                            key={ind}
                            color="blue"
                            onClick={() => window.location.href = `/result?person=${person?.name}`}>
                            {person?.name || UNKNOWN_NAME}
                        </Tag>
                    ))
                ) : NO_REPRESENTATIVE}
            </Descriptions.Item>
        </Descriptions>
        {props.footer}
    </List.Item>
);

export default Abstract;