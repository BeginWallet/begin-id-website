import { useEffect, useState } from "react";
import { BeginId } from "@beginwallet/id";
import { formatShortAddress } from "../app/helpers";
import { IoCopyOutline } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import RootLayout from "@/app/layout";
import Head from "next/head";
import useAsset from "@/hooks/useAsset";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NftImage from "@/components/nft-image";
import { redirect } from "next/navigation";

const MAX_ITEMS = 11

export const getServerSideProps = (async (context) => {
  // Fetch data from external API
  const beginId = new BeginId("31cab9edcc1c530e29924a56167d4ed17d50b7fds");
  // console.log(context.req.headers.host);
  if (!context.req.headers.host) return { props: { profile: null } };

  const name = context.req.headers.host.replace(
    /(\.bgin\.id|\.beginid\.io|\.bgn\.is|.localhost\:3000)$/,
    ""
  );
  console.log({ name });

  const profile = await beginId.resolveAddress(name);
  // console.log({ profile });

  const { getAssets, getByUnit } = useAsset();

  const assets = await getAssets(profile?.address);

  // console.log({assets})

  return { props: { profile, assets: assets || [] } };
}) satisfies GetServerSideProps<{ profile: any }>;

export default function Page({
  profile,
  assets,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  let showCopyAlert = false;

  const router = useRouter();
  // const { nftId } = router.query;
  const [nfts, setNfts] = useState<any[]>();
  const { getByUnit } = useAsset();
  const [selectedNft, setSelectedNft] = useState<any>(null);
  const [nextPage, setNextPage] = useState(0);
  const [loadMore, setLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNfts, setIsLoadingNfts] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleLoadMore = async (_assets: any[]) => {
    if (nextPage > _assets.length) {
      setLoadMore(false);
      return;
    }

    setIsLoadingNfts(true);
    const assets:any[] = [];
    let count = 0;
    let lastIndex = nextPage;
    // await Promise.all(
    // _assets.slice(nextPage).(async (asset: any) => {
    for (const [i, asset] of _assets.slice(nextPage)?.entries()) {
      const details = await getByUnit(asset.unit, Number(asset.quantity));

      if (details && details.isNFT) {
        count += 1;
        assets.push({
          ...details,
          quantity: asset.quantity,
        });
        // return {
        //   ...details,
        //   quantity: asset.quantity,
        // };
      }

      lastIndex += 1;

      if(count >= MAX_ITEMS) {
        break
      };
    }
    // );

    // console.log({assets})

    // const filterAssets = assets
    //   .filter((notUndefined) => notUndefined !== undefined)
    //   .filter((a) => a.isNFT);

    setNextPage(lastIndex);

    if (lastIndex < _assets.length) {
      setLoadMore(true);
    } else {
      setLoadMore(false);
    }

    if (assets){
      setNfts(
        [
          ...nfts|| [],
          ...assets
        ]
      );
    }
    setIsLoadingNfts(false);
    // console.log({ filterAssets });
  };

  useEffect(() => {
    if(!profile){
      router.push('https://begin.is/#beginid');
    }
    // if (!profile){
    //   // window.location.assign('https://begin.is/#beginid')
    //   return;
    // }

    if (profile && !nfts) {
      handleLoadMore(assets);
    }
  }, []);

  const handleAlert = () => {
    setHasCopied(true);

    setTimeout(() => {
      setHasCopied(false);
    }, 1000);
  };

  // const [username, setUsername] = useState<any>();
  // const [profile, setProfile] = useState<any>();
  
  // let profile:any = data;

  // useEffect(() => {

  // }, []);

  // const resolve = async (name: string) => {
  //   const result = await beginId.resolveAddress(name);
  //   console.log({ result });

  //   if (!result){
  //     window.location.assign('https://begin.is')
  //     return;
  //   }

  //   // setProfile(result);
  //   profile = result;
  //   // setIsLoading(false);
  // };
  // const { host } = window.location;

  // const splitHost = host.split(".");
  // setUsername(splitHost[0]);
  let username = profile?.name;
  // resolve(splitHost[0]);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <meta name="apple-mobile-web-app-title" content="B58 Finance"></meta>
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        ></meta>
        {/*iOS Splashscreen Light */}
        <link
          href="splashscreens-light/iphone5_splash.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: light)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-light/iphone6_splash.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: light)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-light/iphoneplus_splash.png"
          media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3) and (prefers-color-scheme: light)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-light/iphonex_splash.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (prefers-color-scheme: light)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-light/iphonexr_splash.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: light)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-light/iphonexsmax_splash.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (prefers-color-scheme: light)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-light/ipad_splash.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: light)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-light/ipadpro1_splash.png"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: light)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-light/ipadpro3_splash.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: light)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-light/ipadpro2_splash.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: light)"
          rel="apple-touch-startup-image"
        />
        {/*iOS Splashscreen Dark */}
        <link
          href="splashscreens-dark/iphone5_splash.png"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: dark)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-dark/iphone6_splash.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: dark)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-dark/iphoneplus_splash.png"
          media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3) and (prefers-color-scheme: dark)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-dark/iphonex_splash.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (prefers-color-scheme: dark)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-dark/iphonexr_splash.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: dark)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-dark/iphonexsmax_splash.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (prefers-color-scheme: dark)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-dark/ipad_splash.png"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: dark)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-dark/ipadpro1_splash.png"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: dark)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-dark/ipadpro3_splash.png"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: dark)"
          rel="apple-touch-startup-image"
        />
        <link
          href="splashscreens-dark/ipadpro2_splash.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (prefers-color-scheme: dark)"
          rel="apple-touch-startup-image"
        />
        <title>{`Begin ID - ${username}.bgin.id`}</title>
        {/* <meta
          httpEquiv="Content-Security-Policy"
          content="default-src https:; frame-ancestors 'none'"
        /> */}
        {/* <meta name="twitter:card" content="app" /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={profile?.text['com.twitter'] || ''} />
        <meta name="twitter:title" content={`Begin ID - ${username}.bgin.id`} />
        <meta
          name="twitter:description"
          content={profile?.text?.description || 'Begin ID - Universal Wallet Address by Begin Wallet'}
        />
        <meta name="twitter:image" content={profile?.image || 'https://begin.is/images/cover.jpeg'} />
        <meta name="twitter:app:name:iphone" content="Begin Wallet" />
        <meta name="twitter:app:id:iphone" content="1642488837" />
        <meta name="twitter:app:url:iphone" content="beginwallet://browse?dappUrl=https://begin.is" />
        <meta name="twitter:app:name:ipad" content="Begin Wallet" />
        <meta name="twitter:app:id:ipad" content="1642488837" />
        <meta name="twitter:app:url:ipad" content="beginwallet://browse?dappUrl=https://begin.is" />
        <meta name="twitter:app:name:googleplay" content="Begin Wallet" />
        <meta name="twitter:app:id:googleplay" content="is.begin.app" />
        <meta name="twitter:app:url:googleplay" content="beginwallet://browse?dappUrl=https://begin.is" />
        <meta name="og:title" content={`Begin ID - ${username}.bgin.id`} />
        <meta
          name="og:description"
          content={profile?.text?.description || 'Universal Wallet Address by Begin Wallet'}
        />
        <meta property="og:image" content={profile?.image || 'https://begin.is/images/cover.jpeg'} />
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        {/* <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
            }}
          /> */}
      </Head>
      <RootLayout>
        <main className="flex flex-col items-center min-h-screen p-8 pt-8">
          {profile?.image && (
            <div style={{
              position: 'absolute',
              width: '100%',
              overflow: 'hidden',
              minWidth: '100%',
              height: '60%',
              zIndex: -1,
              top: 0
            }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundImage: `url(${profile?.image})`,
                  filter: 'contrast(150%) blur(40px) opacity(0.4)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  justifyContent: 'center',
                  position: 'absolute',
                  zIndex: -1,
                  top: 0,
                  left: 0,
                  right: 'auto',
                  width: '100%',
                  height: '25vh',
                  borderBottomLeftRadius: '50%',
                  borderBottomRightRadius: '50%',
                  transform: 'scale(2)',
                }}
              ></div>
            </div>
          )}

          <div className="z-10 w-full max-w-5xl items-center justify-between md:justify-end font-mono text-sm flex md:pb-8">
            {/* <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          BeginID: @{username}
        </p> */}
            <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
              <a
                className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                href="https://begin.is"
                target="_blank"
                rel="noopener noreferrer"
              >
                By{' '}
                <Image
                  src="images/logo.svg"
                  alt="Begin Logo"
                  className="dark:invert"
                  width={100}
                  height={24}
                  priority
                />
              </a>
            </div>
          </div>

          <div className="w-full lg:max-w-5xl">
            <div className="flex rounded-lg relative items-center justify-center">
              <div className="avatar-bg rounded-full p-0.5 shadow-md">
                {profile?.image ? (
                  <a
                    role="button"
                    onClick={() =>
                      setSelectedNft({
                        displayName: `${profile?.name}.bgin.id`,
                        image: profile?.image,
                        fingerprint: profile?.address,
                        policy: profile?.address,
                        description: profile?.text?.description,
                      })
                    }
                  >
                    <div className="w-[96px] h-[96px] relative">
                      <Image
                        src={profile?.image}
                        alt={`Begin ID: ${profile?.name}`}
                        className="rounded-full"
                        // width={96}
                        // height={96}
                        priority
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </a>
                ) : (
                  <div className="animate-pulse w-[96px] h-[96px] rounded-full bg-slate-700"></div>
                )}
              </div>
            </div>
            {isLoading ? (
              <div className="flex w-full h-[300px] items-center justify-center">
                <svg
                  className="animate-spin"
                  width="27"
                  height="26"
                  viewBox="0 0 27 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.7342 14.908C22.3376 16.3087 20.5093 17.1974 18.545 17.4301C18.5664 15.527 18.027 13.6597 16.9941 12.0611C17.5167 12.1382 18.05 12.0935 18.5524 11.9304C19.0548 11.7673 19.5127 11.4903 19.8903 11.121C21.2557 9.78667 21.2371 7.55941 19.8875 6.20976L17.4933 3.81562L21.3072 0L23.7328 2.42594C26.3191 5.01233 26.9648 8.80436 25.6695 11.9932C25.2261 13.0846 24.568 14.0758 23.7342 14.908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M8.82646 22.1847L5.01263 26.0004L2.58704 23.5744C0.000656735 20.988 -0.645046 17.196 0.65029 14.0071C1.24517 12.548 2.21944 11.2744 3.47213 10.3185C4.72483 9.3625 6.21037 8.75894 7.77482 8.5703C7.75338 10.4734 8.29275 12.3407 9.32565 13.9392C8.8031 13.8621 8.26979 13.9068 7.76738 14.0699C7.26498 14.233 6.80708 14.5101 6.42946 14.8794C5.06408 16.2137 5.08266 18.4409 6.43232 19.7906L8.82646 22.1847Z"
                    fill="currentColor"
                  />
                  <path
                    d="M15.0677 23.5744L12.6418 26.0004L8.82652 22.1847L11.2521 19.7592C11.8954 19.1158 12.2568 18.2433 12.2568 17.3336C12.2568 16.4238 11.8954 15.5513 11.2521 14.908C9.59688 13.2528 8.66699 11.0078 8.66699 8.66696C8.66699 6.32613 9.59688 4.08117 11.2521 2.42594L13.678 0L17.4933 3.81562L15.0677 6.2412C14.4244 6.88452 14.0631 7.75702 14.0631 8.66679C14.0631 9.57655 14.4244 10.449 15.0677 11.0924C16.7229 12.7476 17.6528 14.9926 17.6528 17.3334C17.6528 19.6742 16.7229 21.9192 15.0677 23.5744Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex gap-4 flex-col items-center justify-center w-full">
                <div className="mt-4 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold">@{profile?.name}</h3>
                  <p className="text-sm text-gray-500">{profile?.name}.bgin.id</p>
                </div>
                <div className="flex-1 items-center justify-center">
                  <div className="mt-1 p-4 items-center justify-center">
                    {profile?.text?.description && (
                      <div className="text-wrap">
                        <p className="text-sm text-gray-500">Bio</p>
                        <p className="break-word whitespace-pre-line">{profile?.text?.description}</p>
                      </div>
                    )}
                    <div className="flex flex-col justify-between">
                      {profile?.text['com.twitter'] && (
                        <div className="pt-8">
                          <p className="text-sm text-gray-500">Twitter</p>
                          <p>
                            <a
                              className="flex items-center"
                              href={`https://x.com/${profile?.text['com.twitter']}`}
                              target="_blank"
                            >
                              <FaXTwitter style={{ paddingRight: '4px' }} /> @{profile?.text['com.twitter']}
                            </a>
                          </p>
                        </div>
                      )}
                      <div className="pt-8">
                        <p className="text-sm text-gray-500">Addresses</p>
                        <p className="flex items-center">
                          {formatShortAddress(profile?.address || '')}{' '}
                          <a
                            className="pl-2"
                            role="button"
                            onClick={() => {
                              navigator.clipboard.writeText(profile?.address);
                              handleAlert();
                            }}
                          >
                            <IoCopyOutline />
                          </a>
                        </p>
                        {hasCopied && <p className="pt-1 text-sm text-cyan-light dark:text-cyan-dark">Copied to Clipboard!</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                    <div className="mt-6 pb-4">{nfts && nfts.length > 0 && <h3 className="text-xl font-bold">Collectibles (NFTs)</h3>}</div>
                    <div className="w-full grid grid-cols-3 md:grid-cols-6 gap-4 pb-20">
                      {nfts?.map((nft: any, i: number) => {
                        const nth = 4;
                        let closeTag = false;

                        // if (i % nth === nth - 1){
                        //   closeTag = true
                        // }

                        let src = nft.image;

                        return (
                          <div key={nft.fingerprint}>
                            <a
                              role="button"
                              key={i}
                              onClick={() => setSelectedNft(nft)}
                              // href={`/?nftId=${i}`}
                              // as={`/n/${i}`}
                              // ref={
                              //   id === Number(lastViewedPhoto)
                              //     ? lastViewedPhotoRef
                              //     : null
                              // }
                              className="transition duration-150 ease-out hover:z-10 hover:ease-in hover:scale-125 h-auto aspect-square rounded-lg after:content group relative mb-5 block w-full after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                            >
                              <NftImage alt={nft.displayName} imageUrl={nft.image} />
                              {/* <p>{nft.displayName}</p>
                            <p>{nft.description}</p>
                            <p>{nft.fingerprint}</p> */}
                            </a>
                          </div>
                        );
                      })}
                      {nfts && loadMore && (
                        <div key={'load-more'}>
                          <a
                            aria-disabled={isLoadingNfts}
                            role="button"
                            onClick={() => handleLoadMore(assets)}
                            // href={`/?nftId=${i}`}
                            // as={`/n/${i}`}
                            // ref={
                            //   id === Number(lastViewedPhoto)
                            //     ? lastViewedPhotoRef
                            //     : null
                            // }
                            className="transition duration-150 ease-out hover:z-10 hover:ease-in hover:scale-125  font-bold text-md underline flex items-center justify-center aspect-square h-auto w-full rounded-lg hover:bg-gray-400 hover:opacity-50 after:content group relative mb-5 block after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                            // className="items-center text-lg transition duration-150 ease-out hover:z-10 hover:ease-in hover:scale-125 h-auto aspect-square rounded-lg after:content group relative mb-5 block w-full after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                          >
                            {isLoadingNfts && (
                                <svg
                                  className="p-10 animate-spin"
                                  viewBox="0 0 27 26"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M23.7342 14.908C22.3376 16.3087 20.5093 17.1974 18.545 17.4301C18.5664 15.527 18.027 13.6597 16.9941 12.0611C17.5167 12.1382 18.05 12.0935 18.5524 11.9304C19.0548 11.7673 19.5127 11.4903 19.8903 11.121C21.2557 9.78667 21.2371 7.55941 19.8875 6.20976L17.4933 3.81562L21.3072 0L23.7328 2.42594C26.3191 5.01233 26.9648 8.80436 25.6695 11.9932C25.2261 13.0846 24.568 14.0758 23.7342 14.908Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M8.82646 22.1847L5.01263 26.0004L2.58704 23.5744C0.000656735 20.988 -0.645046 17.196 0.65029 14.0071C1.24517 12.548 2.21944 11.2744 3.47213 10.3185C4.72483 9.3625 6.21037 8.75894 7.77482 8.5703C7.75338 10.4734 8.29275 12.3407 9.32565 13.9392C8.8031 13.8621 8.26979 13.9068 7.76738 14.0699C7.26498 14.233 6.80708 14.5101 6.42946 14.8794C5.06408 16.2137 5.08266 18.4409 6.43232 19.7906L8.82646 22.1847Z"
                                    fill="currentColor"
                                  />
                                  <path
                                    d="M15.0677 23.5744L12.6418 26.0004L8.82652 22.1847L11.2521 19.7592C11.8954 19.1158 12.2568 18.2433 12.2568 17.3336C12.2568 16.4238 11.8954 15.5513 11.2521 14.908C9.59688 13.2528 8.66699 11.0078 8.66699 8.66696C8.66699 6.32613 9.59688 4.08117 11.2521 2.42594L13.678 0L17.4933 3.81562L15.0677 6.2412C14.4244 6.88452 14.0631 7.75702 14.0631 8.66679C14.0631 9.57655 14.4244 10.449 15.0677 11.0924C16.7229 12.7476 17.6528 14.9926 17.6528 17.3334C17.6528 19.6742 16.7229 21.9192 15.0677 23.5744Z"
                                    fill="currentColor"
                                  />
                                </svg>
                            )}
                            {!isLoadingNfts && 'Load More'}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
              </div>
            )}
          </div>
          {/* <!-- Main modal --> */}
          {selectedNft && (
            <div
              id={`default-modal`}
              tabIndex={-1}
              aria-hidden="true"
              className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
              <div className="relative p-4 w-full max-w-2xl max-h-full rounded-lg">
                {/* <!-- Modal content --> */}
                <div className="relative bg-modal rounded-lg shadow">
                  {/* <!-- Modal header --> */}
                  <div className="flex items-center justify-between p-4 pb-2 md:p-5 md:pb-2 rounded-t dark:border-gray-600">
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-hide="default-modal"
                      onClick={() => setSelectedNft(null)}
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  {/* <!-- Modal body --> */}
                  <div className="p-4 md:p-5 space-y-4">
                    <img
                      alt={selectedNft.displayName}
                      className="object-cover h-auto w-full rounded-lg"
                      src={selectedNft.image}
                    />
                    <p className="text-lg leading-relaxed">{selectedNft.displayName}</p>
                    <p className="text-sm leading-relaxed text-gray-500">
                      <a
                        href={`https://pool.pm/${selectedNft.fingerprint}`}
                        target="_blank"
                        className="underline font-bold"
                      >
                        Pool.pm: {formatShortAddress(selectedNft?.policy || '')}
                      </a>
                    </p>
                    <p className="pb-4">{selectedNft.description}</p>
                  </div>
                  {/* <!-- Modal footer --> */}
                  {/* <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                                            <button data-modal-hide="default-modal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                                            <button data-modal-hide="default-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Decline</button>
                                        </div> */}
                </div>
              </div>
            </div>
          )}

          <div className="w-full footer">
            <p className="text-center text-sm text-gray-500">Begin ID - Universal Wallet Address</p>
          </div>

          {/* <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div> */}

          {/* <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div> */}
        </main>
      </RootLayout>
    </>
  );
}
