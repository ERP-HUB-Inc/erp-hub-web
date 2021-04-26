import { normalize, schema } from "normalizr";

export default class Schema {
  constructor() {
    this.entityName = "";
    this.schema = {};
  }

  createEntity() {
    return new schema.Entity(this.entityName, this.schema);
  }

  defineSchema(entity) {
    return { [this.entityName]: [ entity ] };
  }

  makeNormalize(data, schema) {
    return normalize(data, schema);
  }
}