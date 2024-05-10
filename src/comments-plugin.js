import * as t from "@babel/types";

const visitor = {
  StringLiteral(path) {
    path.node.extra.raw = path.node.extra.raw.replace(/'/g, '"');
  }
}

export default visitor;
  