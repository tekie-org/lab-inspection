/* eslint-disable @typescript-eslint/no-explicit-any */
import MD5 from 'crypto-js/md5';

const getSystemUUID = async (systemInfo: any) => {
  const systemUUID = systemInfo?.system?.uuid;
  const osUUID = systemInfo?.uuid?.os;
  const macAddress = systemInfo?.uuid?.macs[0];

  const uuid = `${systemUUID || osUUID || ''}::${macAddress || ''}`;

  const md5String = MD5(uuid).toString();

  return md5String || '';
};

export default getSystemUUID;
