import { Case, Court, Document, Footer, Persons } from "../util/type";

/**
 * An abstract of a case.
 */
export interface CaseAbstract {
    id: number, // 该案件序列号
    content: string, // 案件摘要
    court: Court, // 审理法院
    document: Document, // 文书相关信息
    _case: Case, // 案件附属信息
    persons: Persons, // 涉案人员信息
    footer: Footer, // 页脚信息(法官信息)
    score: number, // 相似度评分
}