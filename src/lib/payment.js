import * as openpgp from 'openpgp';
import { v4 as uuidv4 } from 'uuid';
import { publicKey, tirrelServer } from './constants';

export const createCardUrl = `${tirrelServer}/third/create-card`
export const buyUrl = `${tirrelServer}/third/buy`

export const createCard = async (cardDetails, billingDetails) => {
  const decodedPublicKey = await openpgp.readKey({ armoredKey: atob(publicKey) });

  const toEncrypt = { number: cardDetails.number, cvv: cardDetails.cvv };
  const encryptedData = await openpgp.encrypt({
    message: await openpgp.createMessage({ text: JSON.stringify(toEncrypt) }),
    encryptionKeys: decodedPublicKey,
  }).then(message => btoa(message));

  let data = {
    billingDetails: {...billingDetails, country: 'US'},
    email: billingDetails.email,
    expMonth: cardDetails.expMonth,
    expYear: cardDetails.expYear,
    encryptedData,
    idempotencyKey: uuidv4(),
    keyId: 'key1', // TODO 
  }
  const target = createCardUrl;
  const res = await fetch(target, {
    method: 'POST',
    headers: { 'Content-type': 'text/json' },
    body: JSON.stringify(data)
  });

  return res;
}

export const buyPlanet = async (session, planet) => {
  const res = await fetch(buyUrl, {
    method: 'POST',
    headers: {'Content-type': 'text/json'},
    body: JSON.stringify({ session, planet })
  });
  return res;
};

// export const createPayment = async (session, cardId, cvv) => {
//   const toEncrypt = { cvv };
//   const decodedPublicKey = await openpgp.readKey({ armoredKey: atob(publicKey) });
//   const encryptedData = await openpgp.encrypt({
//     message: await openpgp.createMessage({ text: JSON.stringify(toEncrypt) }),
//     encryptionKeys: decodedPublicKey,
//   }).then(message => btoa(message));

//   const create = buyUrl;
//   await fetch(create, {
//     method: 'POST',
//     headers: { 'Content-type': 'text/json' },
//     body: JSON.stringify({
//       idempotencyKey: session,
//       cardId,
//       encryptedData,
//     })
//   });

//   return;
// };

export const isBillingDetailsError = ({ code }) =>
  !([1100, 1110, 1109, 1032].includes(Number(code)));
