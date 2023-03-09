/* eslint-disable @typescript-eslint/no-explicit-any */
import MD5 from 'crypto-js/md5';

const getSystemUUID = async (systemInfo: any) => {
  const systemUUID = systemInfo?.system?.uuid;
  const osUUID = systemInfo?.uuid?.os;
  const macAddress = systemInfo?.uuid?.macs[0];
  try {
  
    const uuid = `${systemUUID || osUUID || ''}::${macAddress || ''}`;
  
    const md5 = MD5(uuid);

    const md5String = md5?.toString() || '';
  
    return md5String || '';
  } catch {
    return macAddress || systemUUID || osUUID || ''; 
  }
};

export default getSystemUUID;
