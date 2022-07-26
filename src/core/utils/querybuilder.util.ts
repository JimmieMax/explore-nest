import { QueryBuilder } from 'typeorm';

export class QueryBuilderUtil {
  static hasJoined<T>(qb: QueryBuilder<T>, tableAlias: string) {
    const joinAttributes = qb.expressionMap.joinAttributes;
    if (!joinAttributes.length || !tableAlias.length) {
      return false;
    }
    const index = joinAttributes.findIndex(
      (attribute) => attribute.alias.name === tableAlias,
    );
    return index >= 0;
  }
}
