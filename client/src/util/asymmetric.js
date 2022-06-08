import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

function generateKeyPair() {
  return nacl.box.keyPair();
}

function encrypt(message, myPrivateKey, theirPublicKey) {
  const one_time_code = nacl.randomBytes(24);

  //Get the cipher text
  const cipher_text = nacl.box(
    naclUtil.decodeUTF8(message),
    one_time_code,
    theirPublicKey,
    myPrivateKey
  );

  //message to be sent
  const message_in_transit = { cipher_text, one_time_code };

  return message_in_transit;
}

function encode_message_in_transit(message) {
  return {
    cipher_text: naclUtil.encodeBase64(message.cipher_text),
    one_time_code: naclUtil.encodeBase64(message.one_time_code),
  };
}
function decode_message_in_transit(message) {
  return {
    cipher_text: naclUtil.decodeBase64(message.cipher_text),
    one_time_code: naclUtil.decodeBase64(message.one_time_code),
  };
}

function decrypt(message_with_code, myPrivateKey, theirPublicKey) {
  //Get the decoded message
  let decoded_message = nacl.box.open(
    message_with_code.cipher_text,
    message_with_code.one_time_code,
    theirPublicKey,
    myPrivateKey
  );

  //Get the human readable message
  let plain_text = naclUtil.encodeUTF8(decoded_message);

  //return the plaintext
  return plain_text;
}

// Function to encode a key pair to be saved to localstorage
function encodeKeyPair(keyPair) {
  const encodedPrivateKey = naclUtil.encodeBase64(keyPair.secretKey);
  const encodedPublicKey = naclUtil.encodeBase64(keyPair.publicKey);

  return { encodedPrivateKey, encodedPublicKey };
}

function decodeKeyPair({ encodedPrivateKey, encodedPublicKey }) {
  return {
    publicKey: naclUtil.decodeBase64(encodedPublicKey),
    secretKey: naclUtil.decodeBase64(encodedPrivateKey),
  };
}

function decodePublicKey(encodedPublicKey) {
  return naclUtil.decodeBase64(encodedPublicKey);
}

export {
  encodeKeyPair,
  decodeKeyPair,
  generateKeyPair,
  decrypt,
  encrypt,
  decodePublicKey,
  encode_message_in_transit,
  decode_message_in_transit,
};
