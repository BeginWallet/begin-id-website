const ipfs= 'https://c-ipfs-gw.nmkr.io/ipfs';

export const formatShortAddress = (addr: String): React.ReactNode => {
  return addr.substring(0, 8) + "..." + addr.substring(addr.length - 6);
};

export const formatShortAddressCustom = (
  addr: String,
  end = 6
): React.ReactNode => {
  return addr.substring(0, 8) + "..." + addr.substring(addr.length - end);
};

export const convertMetadataPropToString = (src: string | Array<string>) => {
  if (typeof src === "string") return src;
  else if (Array.isArray(src)) return src.join("");
  return null;
};

export const linkToSrc = (link: string, base64: boolean = false) => {
  const linkParsed = convertMetadataPropToString(link) || "";
  const base64regex =
    /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

  const ipfsGateway = 'https://ipfs.io/ipfs';
  if (linkParsed.startsWith(ipfsGateway)) return linkParsed.replace(ipfsGateway, ipfs);
  if (linkParsed.startsWith("https://")) return linkParsed;
  else if (linkParsed.startsWith("ipfs://"))
    return (
      ipfs +
      "/" +
      linkParsed.split("ipfs://")[1].split("ipfs/").slice(-1)[0]
    );
  else if (
    (linkParsed.startsWith("Qm") && linkParsed.length === 46) ||
    (linkParsed.startsWith("baf") && linkParsed.length === 59)
  ) {
    return ipfs + "/" + linkParsed;
  } else if (base64 && base64regex.test(linkParsed))
    return "data:image/png;base64," + linkParsed;
  else if (linkParsed.startsWith("data:image")) return linkParsed;
  return null;
};
