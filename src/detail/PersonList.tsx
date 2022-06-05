import { List, Typography, Avatar, Tag } from "antd";
import React from "react";
import { Md5 } from "ts-md5";
import KVPair from "../components/KVPair";
import { TAG_COLOR } from "../constants/strings";
import { getBackgroundColor } from "../util/avatarColor";

const { Text, Title, Paragraph } = Typography;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PersonList = ({ list, isRepresentative }: { list: any[], isRepresentative: boolean }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrap = (o: any) => (
        Array.isArray(o) ? o : [o]
    );
    
    return (
        <List
            dataSource={list}
            itemLayout="vertical"
            renderItem={(person) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={
                            <Avatar
                                style={{
                                    color: "white",
                                    background: getBackgroundColor(person.name || "N")
                                }}>
                                {person.name === undefined ? "未知" : person.name[0]}
                            </Avatar>
                        }
                        title={person.name === undefined ? "未知名称" : person.name}
                        description={person.status || "暂无相关身份信息"}
                    />
                    <Tag color={TAG_COLOR[parseInt(Md5.hashStr(person.type || "N"), 16) % TAG_COLOR.length]}>
                        {person.type || "未知类别"}
                    </Tag>
                    <Tag color={TAG_COLOR[parseInt(Md5.hashStr(person.gender || "N"), 16) % TAG_COLOR.length]}>
                        {person.gender || "性别未知或不适用"}
                    </Tag>
                    <Tag color={TAG_COLOR[parseInt(Md5.hashStr(person.ethnicity || "N"), 16) % TAG_COLOR.length]}>
                        {person.ethnicity || "民族未知或不适用"}
                    </Tag>
                    <Tag color={TAG_COLOR[parseInt(Md5.hashStr(person.nationality || "N"), 16) % TAG_COLOR.length]}>
                        {person.nationality || "国籍未知或不适用"}
                    </Tag>
                    <div style={{ marginTop: "12px" }}>
                        {person.birthday && <KVPair k="出生日期" v={person.birthday} />}
                        {person.location && <KVPair k="所在地址" v={person.location} />}
                        {person.identity && <KVPair k="自然人身份" v={person.identity} />}
                        {isRepresentative && person.representationType && <KVPair k="代理种类" v={person.representationType} />}
                        {isRepresentative && person.representativeOccupation && <KVPair k="代理人辩护人职业类型" v={person.representativeOccupation} />}
                        {isRepresentative && person.representativeType && <KVPair k="辩护人或诉讼代理人类型" v={person.representativeType} />}
                    </div>
                    <Typography>
                        <Text>{person.description || "暂无相关介绍信息"}</Text>
                        {isRepresentative && wrap(person.objects).length > 0 && (
                            <Paragraph style={{ marginTop: "12px" }}>
                                <Title level={5}>{"代理对象"}</Title>
                                <Text>{(wrap(person.objects) as string[]).join(" & ")}</Text>
                            </Paragraph>
                        )}
                    </Typography>
                </List.Item>
            )}
            locale={{ emptyText: <Text type="secondary">{"未找到相关信息"}</Text> }}
        />
    );
};

export default PersonList;