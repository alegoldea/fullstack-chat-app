import naclUtil from "tweetnacl-util";
import nacl from "tweetnacl";

function generateChatKey() {
  return naclUtil.encodeBase64(nacl.randomBytes(32));
}

export { generateChatKey };
