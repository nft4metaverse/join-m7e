import React from 'react';
import { ethers } from 'ethers';
import { itemsFromSvg, getImageForLoot } from './loot-util';

import abi from './abi.json';

export default function Loot({
  providers,
  address,
}: {
  providers: ethers.providers.Web3Provider;
  address: string;
}) {
  const [avatar, setAvatar] = React.useState<string>('');

  React.useEffect(() => {
    if (!address || !providers) return;
  
    const syntheticLoot = new ethers.Contract(
      '0x869ad3dfb0f9acb9094ba85228008981be6dbdde',
      abi,
      providers.getSigner(0),
    );

    getAvatar(syntheticLoot, address);
  }, [address]);

  const getAvatar = async (loot: ethers.Contract, address: string) => {
    const tokenURIB64 = await loot.tokenURI(address);
    const tokenURI = JSON.parse(Buffer.from(tokenURIB64.split(',')[1], 'base64').toString('utf8'));
    const b64svg = tokenURI.image;
    const svg = Buffer.from(b64svg.split(',')[1], 'base64').toString('utf8');

    const items = itemsFromSvg(svg);
    console.log(items);
    const img = await getImageForLoot(items);
    console.log(img);

    setAvatar(img);
  };

  return (
    <div className="border border-white w-80 h-80 sm:w-96	sm:h-96 flex justify-center items-center">
      { avatar ? <img className="w-full h-full" src={avatar} /> : <div className="text-white">Loading...</div> }
    </div>
  );
}
