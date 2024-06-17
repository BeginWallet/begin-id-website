export const formatShortAddress = (addr: String): React.ReactNode => {
  return addr.substring(0, 8) + "..." + addr.substring(addr.length - 6);
};

export const formatShortAddressCustom = (
  addr: String,
  end = 6
): React.ReactNode => {
  return addr.substring(0, 8) + "..." + addr.substring(addr.length - end);
};
