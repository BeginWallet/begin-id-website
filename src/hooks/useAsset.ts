import {
  convertMetadataPropToString,
  formatShortAddress,
  linkToSrc,
} from "@/app/helpers";
import AssetFingerprint from "@emurgo/cip14-js";
import valid8 from "valid-8";

const useAsset = () => {
  const adaAsset = {
    name: "Cardano",
    displayName: "Cardano",
    unit: "lovelace",
    ticker: "ADA",
    decimals: 18,
    quantity: 0,
    image: "",
    isNFT: false,
    is_verified: true,
    token_ascii: "Cardano",
    token_id: "lovelace",
  };

  const parseAsset = (unit: string, assetDetails: any, quantity: Number) => {
    const asset: any = {};
    asset.unit = unit;
    asset.policy = unit.slice(0, 56);
    asset.name = Buffer.from(unit.slice(56), "hex").toString("utf-8");

    const onchainMetadata =
      assetDetails.onchainMetadata &&
      ((assetDetails.onchainMetadata &&
        assetDetails.onchainMetadata[asset.policy] &&
        assetDetails.onchainMetadata[asset.policy][assetDetails.asset_name]) ||
        assetDetails.onchainMetadata);

    asset.displayName =
      (onchainMetadata && onchainMetadata.name) ||
      (assetDetails.metadata && assetDetails.metadata.name) ||
      asset.name;

    asset.fingerprint = AssetFingerprint.fromParts(
      Buffer.from(asset.policy, "hex"),
      Buffer.from(unit.slice(56), "hex")
    ).fingerprint();

    // console.log('is valid8 >>> ', valid8(Buffer.from(unit.slice(56), 'hex')));
    if (!valid8(Buffer.from(unit.slice(56), "hex"))) {
      if (!onchainMetadata) {
        asset.name = asset.fingerprint;
        asset.displayName =
          formatShortAddress(asset.fingerprint)?.toString() ||
          formatShortAddress(asset.policy)?.toString() ||
          "-";
      } else {
        asset.name = asset.displayName;
      }

      //   console.log('not valid use display name >>> ', asset.displayName);
    }

    // console.log('asset.displayName', asset.displayName);

    if (!asset.displayName) {
      asset.displayName =
        formatShortAddress(asset.fingerprint)?.toString() ||
        formatShortAddress(asset.policy)?.toString() ||
        "-";
    }

    if (!asset.name) {
      if (asset.displayName) asset.name = asset.displayName;
      else asset.name = "-";
    }

    // if (assetDetails.asset_name && assetDetails.onchainMetadata)
    //     console.log(assetDetails.onchainMetadata[asset.policy][assetDetails.asset_name])
    // console.log(assetDetails.metadata)
    asset.ticker =
      (assetDetails.onchainMetadata && assetDetails.onchainMetadata.ticker) ||
      (assetDetails.onchainMetadata && assetDetails.onchainMetadata.symbol) ||
      (assetDetails.metadata && assetDetails.metadata.ticker);
    const metaDescription =
      (assetDetails.asset_name &&
        assetDetails.onchainMetadata &&
        assetDetails.onchainMetadata[asset.policy] &&
        assetDetails.onchainMetadata[asset.policy][assetDetails.asset_name] &&
        assetDetails.onchainMetadata[asset.policy][assetDetails.asset_name]
          .description) ||
      (assetDetails.onchainMetadata &&
        assetDetails.onchainMetadata.description) ||
      (assetDetails.metadata && assetDetails.metadata.description) ||
      "";
    asset.description = Array.isArray(metaDescription)
      ? metaDescription.join(" ")
      : metaDescription;
    asset.metaData =
      (assetDetails.asset_name &&
        assetDetails.onchainMetadata &&
        assetDetails.onchainMetadata[asset.policy] &&
        assetDetails.onchainMetadata[asset.policy][assetDetails.asset_name] &&
        assetDetails.onchainMetadata[asset.policy][assetDetails.asset_name]
          .description) ||
      (assetDetails.onchainMetadata && assetDetails.onchainMetadata) ||
      "";
    asset.image =
      (assetDetails.asset_name &&
        assetDetails.onchainMetadata &&
        assetDetails.onchainMetadata[asset.policy] &&
        assetDetails.onchainMetadata[asset.policy][assetDetails.asset_name] &&
        assetDetails.onchainMetadata[asset.policy][assetDetails.asset_name]
          .image &&
        linkToSrc(
          convertMetadataPropToString(
            assetDetails.onchainMetadata[asset.policy][assetDetails.asset_name]
              .image
          ) || ""
        )) ||
      (assetDetails.onchainMetadata &&
        assetDetails.onchainMetadata.image &&
        linkToSrc(
          convertMetadataPropToString(assetDetails.onchainMetadata.image) || "",
          true
        )) ||
      (assetDetails.onchainMetadata &&
        assetDetails.onchainMetadata.logo &&
        linkToSrc(
          convertMetadataPropToString(assetDetails.onchainMetadata.logo) || ""
        )) ||
      (assetDetails.metadata &&
        assetDetails.metadata.logo &&
        linkToSrc(assetDetails.metadata.logo, true)) ||
      "";
    asset.decimals =
      (assetDetails.metadata && assetDetails.metadata.decimals) ||
      (assetDetails.onchainMetadata && assetDetails.onchainMetadata.decimals) ||
      0;
    asset.isNFT =
      (!asset.ticker &&
        quantity === 1 &&
        assetDetails.asset_name &&
        assetDetails.onchainMetadata &&
        ((assetDetails.onchainMetadata &&
          assetDetails.onchainMetadata.tokenType &&
          assetDetails.onchainMetadata.tokenType !== "token") ||
          (assetDetails.onchainMetadata &&
            assetDetails.onchainMetadata.image) ||
          (assetDetails.onchainMetadata[asset.policy] &&
            assetDetails.onchainMetadata[asset.policy][
              assetDetails.asset_name
            ] &&
            assetDetails.onchainMetadata[asset.policy][assetDetails.asset_name]
              .image)) &&
        true) ||
      false;

    asset.time = Date.now();

    return asset;
  };

  const getByUnit = async (
    unit: string,
    quantity: Number
  ): Promise<any | undefined> => {
    let result: any;
    let assetDetails: any = {};

    if (unit) {
      if (unit === "lovelace") {
        return adaAsset;
      } else {
        result = await getAssetDetails(unit);
        if (result) {
          assetDetails = {
            ...result,
            metadata: result.metadata,
            onchainMetadata: result.onchain_metadata,
          };

          // console.log(unit)
        //   console.log('assetDetails', assetDetails);
          return parseAsset(unit, assetDetails, quantity);
        } else {
          console.log("unit", unit);
          return null;
        }
      }
    } else {
      return result;
    }
  };

  const getAssetDetails = async (unit: string) => {
    const api_key = process.env.NEXT_PUBLIC_BLOCK_FROST_PROJECT_ID || "";
    const api_url = `https://cardano-mainnet.blockfrost.io/api/v0//assets/${unit}`;

    const result = await fetch(api_url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        project_id: api_key,
      },
    })
      .then((res) => (res.ok ? res : Promise.reject(res)))
      .then((res) => res.json())
      .catch((error) => console.log(error));

    return result || null;
  };

  const getAssets = async (address: string) => {
    const api_key = process.env.NEXT_PUBLIC_BLOCK_FROST_PROJECT_ID || "";
    const api_url = `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}/extended?order=desc`; //&page=2&count=100

    const result = await fetch(api_url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        project_id: api_key,
      },
    })
      .then((res) => (res.ok ? res : Promise.reject(res)))
      .then((res) => res.json())
      .catch((error) => console.log(error));

    const assets = result?.amount || null

    // let assets:any[] = [];
    // if(amount) {
    //     assets = await Promise.all(await amount.map(async (asset:any) => {
    //         const details = await getByUnit(asset.unit, Number(asset.quantity));
    //         if(details) {
    //             return {
    //                 ...details,
    //                 quantity: asset.quantity
    //             }
    //         }
    //     }))
    // }

    console.log({assets})

    // const assetsClean = [...assets.filter((notUndefined) => notUndefined !== undefined)]
    

    // return {ft: assetsClean.filter(a => !a.isNFT), nft: assetsClean.filter(a => a.isNFT)} || null;
    return assets || []
  };

  return { parseAsset, getAssets, getAssetDetails, getByUnit };
};

export default useAsset;
