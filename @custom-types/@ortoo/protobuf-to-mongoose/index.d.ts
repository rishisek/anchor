declare module "@ortoo/protobuf-to-mongoose" {
  import { Schema } from "mongoose";
  export default function schemaFromProtoSync(
    fname: String,
    messageName: String
  ): Schema;
  export default function schemaFromProtoSync(
    fname: String
  ): (messageName: String) => Schema;
}
