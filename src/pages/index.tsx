import Image from "next/image";
import { useEffect, useState } from "react";
import { BeginId } from "@beginwallet/id";
import { formatShortAddress } from "../app/helpers";
import { IoCopyOutline } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import RootLayout from "@/app/layout";
import Head from "next/head";
import useAsset from "@/hooks/useAsset";
import { useRouter } from "next/router";
import Link from "next/link";


const nftPlaceholder = 'data:image/png;base64,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'

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
  const { nftId } = router.query;
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

      if(count >= 9) {
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
    if (profile && !nfts) {
      handleLoadMore(assets);
    }
  }, []);

  const handleAlert = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
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
        <title>{`BeginID - ${username}.bgin.id`}</title>
        {/* <meta
          httpEquiv="Content-Security-Policy"
          content="default-src https:; frame-ancestors 'none'"
        /> */}
        {/* <meta name="twitter:card" content="app" /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:site"
          content={profile?.text["com.twitter"] || ""}
        />
        <meta name="twitter:title" content={`BeginID - ${username}.bgin.id`} />
        <meta
          name="twitter:description"
          content={
            profile?.text?.description ||
            "Universal Wallet Address by Begin Wallet"
          }
        />
        <meta
          name="twitter:image"
          content={profile?.image || "https://begin.is/images/cover.jpeg"}
        />
        <meta name="twitter:app:name:iphone" content="Begin Wallet" />
        <meta name="twitter:app:id:iphone" content="1642488837" />
        <meta
          name="twitter:app:url:iphone"
          content="beginwallet://browse?dappUrl=https://begin.is"
        />
        <meta name="twitter:app:name:ipad" content="Begin Wallet" />
        <meta name="twitter:app:id:ipad" content="1642488837" />
        <meta
          name="twitter:app:url:ipad"
          content="beginwallet://browse?dappUrl=https://begin.is"
        />
        <meta name="twitter:app:name:googleplay" content="Begin Wallet" />
        <meta name="twitter:app:id:googleplay" content="is.begin.app" />
        <meta
          name="twitter:app:url:googleplay"
          content="beginwallet://browse?dappUrl=https://begin.is"
        />
        <meta name="og:title" content={`BeginID - ${username}.bgin.id`} />
        <meta
          name="og:description"
          content={
            profile?.text?.description ||
            "Universal Wallet Address by Begin Wallet"
          }
        />
        <meta
          property="og:image"
          content={profile?.image || "https://begin.is/images/cover.jpeg"}
        />
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
        <main className="flex min-h-screen flex-col items-center justify-flex-start p-8 pt-8">
          <div className="z-10 w-full max-w-5xl items-center justify-between md:justify-end font-mono text-sm lg:flex md:pb-8">
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
                By{" "}
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
            <div className="flex w-full rounded-lg bg-[#3414FC] relative h-28">
              <div className="avatar-bg rounded-full p-1 absolute -bottom-[50px] left-3 ">
                {profile?.image ? (
                  <Image
                    src={profile?.image}
                    alt={`BeginID: ${profile?.name}`}
                    className="rounded-full"
                    width={96}
                    height={96}
                    priority
                  />
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
              <div className="flex gap-4 flex-col md:flex-row">
                <div className="flex-none">
                  <div className="mt-12 p-4">
                    <h3 className="text-xl text-bold">
                      {profile?.name}.bgin.id
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatShortAddress(profile?.address || "")}
                    </p>
                    {profile?.text?.description && (
                      <div className="pt-8">
                        <p className="text-sm text-gray-500">Bio</p>
                        <p>{profile?.text?.description}</p>
                      </div>
                    )}
                    <div className="flex flex-row md:flex-col justify-between">
                      {profile?.text["com.twitter"] && (
                        <div className="pt-8">
                          <p className="text-sm text-gray-500">Twitter</p>
                          <p>
                            <a
                              className="flex items-center"
                              href={`https://x.com/${profile?.text["com.twitter"]}`}
                              target="_blank"
                            >
                              <FaXTwitter style={{ paddingRight: "4px" }} /> @
                              {profile?.text["com.twitter"]}
                            </a>
                          </p>
                        </div>
                      )}
                      <div className="pt-8">
                        <p className="text-sm text-gray-500">Addresses</p>
                        <p className="flex items-center">
                          {formatShortAddress(profile?.address || "")}{" "}
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
                          {showCopyAlert && (
                            <span className="text-sm">
                              Copied to Clipboard!
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1 pt-8">
                  <div className="pb-4">
                    {nfts && nfts.length > 0 && (
                      <h3 className="text-xl text-bold">NFTs</h3>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {nfts?.map((nft: any, i: number) => {
                      const nth = 4;
                      let closeTag = false;

                      // if (i % nth === nth - 1){
                      //   closeTag = true
                      // }

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
                            className="transition duration-150 ease-out hover:z-10 hover:ease-in hover:scale-125 h-48 w-48 rounded-lg after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                          >
                            <Image
                              alt={nft.displayName}
                              className="rounded-lg"
                              placeholder={nftPlaceholder}
                              // blurDataURL={nftPlaceholder}
                              objectFit="cover"
                              fill
                              // width={48}
                              // height={48}
                              src={nft.image}
                            />
                            {/* <p>{nft.displayName}</p>
                          <p>{nft.description}</p>
                          <p>{nft.fingerprint}</p> */}
                          </a>
                        </div>
                      );
                    })}
                    {nfts && loadMore && (
                      <div key={"load-more"}>
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
                          className="flex items-center justify-center h-48 w-48 rounded-lg hover:bg-gray-400 hover:opacity-50 after:content group relative mb-5 block after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                        >
                          {isLoadingNfts && (
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
                          )}
                          {!isLoadingNfts && "Load More"}
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
                    <p className="text-lg leading-relaxed">
                      {selectedNft.displayName}
                    </p>
                    <p className="text-sm leading-relaxed text-gray-500">
                      <a
                        href={`https://pool.pm/${selectedNft.fingerprint}`}
                        target="_blank"
                        className="underline text-bold"
                      >
                        Pool.pm: {formatShortAddress(selectedNft?.policy)}
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
            <p className="text-center text-sm text-gray-500">
              BeginID - Universal Wallet Address
            </p>
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
