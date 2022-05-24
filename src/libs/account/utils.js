export function getLocalObject(name) {
  const text = localStorage.getItem(name);
  if (text) {
    return JSON.parse(text);
  }
  return null;
}

function getLocalAccounts() {
  return getLocalObject("accounts");
}

export const getDefaultAccountDevice = () => {
  const accounts = getLocalAccounts();
  if (!accounts) {
    return "";
  }
  const defaultWallet = localStorage.getItem("default-wallet");

  if (!defaultWallet) {
    return "";
  }

  return accounts[defaultWallet].device;
};
