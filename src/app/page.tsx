"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BeginId } from "@beginwallet/id";
import { formatShortAddress } from "./helpers";
import { IoCopyOutline } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";

export default function Home() {
  const beginId = new BeginId("31cab9edcc1c530e29924a56167d4ed17d50b7fds");

  const [username, setUsername] = useState<any>();
  const [profile, setProfile] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolve = async (name: string) => {
      const result = await beginId.resolveAddress(name);
      console.log({ result });

      if (!result){
        window.location.assign('https://begin.is')
        return;
      }

      setProfile(result);
      setIsLoading(false);
    };
    const { host } = window.location;

    const splitHost = host.split(".");
    setUsername(splitHost[0]);
    resolve(splitHost[0]);
  }, []);

  return (
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
            <svg className="animate-spin" width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.7342 14.908C22.3376 16.3087 20.5093 17.1974 18.545 17.4301C18.5664 15.527 18.027 13.6597 16.9941 12.0611C17.5167 12.1382 18.05 12.0935 18.5524 11.9304C19.0548 11.7673 19.5127 11.4903 19.8903 11.121C21.2557 9.78667 21.2371 7.55941 19.8875 6.20976L17.4933 3.81562L21.3072 0L23.7328 2.42594C26.3191 5.01233 26.9648 8.80436 25.6695 11.9932C25.2261 13.0846 24.568 14.0758 23.7342 14.908Z" fill="currentColor"/>
            <path d="M8.82646 22.1847L5.01263 26.0004L2.58704 23.5744C0.000656735 20.988 -0.645046 17.196 0.65029 14.0071C1.24517 12.548 2.21944 11.2744 3.47213 10.3185C4.72483 9.3625 6.21037 8.75894 7.77482 8.5703C7.75338 10.4734 8.29275 12.3407 9.32565 13.9392C8.8031 13.8621 8.26979 13.9068 7.76738 14.0699C7.26498 14.233 6.80708 14.5101 6.42946 14.8794C5.06408 16.2137 5.08266 18.4409 6.43232 19.7906L8.82646 22.1847Z" fill="currentColor"/>
            <path d="M15.0677 23.5744L12.6418 26.0004L8.82652 22.1847L11.2521 19.7592C11.8954 19.1158 12.2568 18.2433 12.2568 17.3336C12.2568 16.4238 11.8954 15.5513 11.2521 14.908C9.59688 13.2528 8.66699 11.0078 8.66699 8.66696C8.66699 6.32613 9.59688 4.08117 11.2521 2.42594L13.678 0L17.4933 3.81562L15.0677 6.2412C14.4244 6.88452 14.0631 7.75702 14.0631 8.66679C14.0631 9.57655 14.4244 10.449 15.0677 11.0924C16.7229 12.7476 17.6528 14.9926 17.6528 17.3334C17.6528 19.6742 16.7229 21.9192 15.0677 23.5744Z" fill="currentColor"/>
            </svg>
          </div>
        ): (
          <div className="mt-12 p-4">
          <h3 className="text-xl text-bold">{profile?.name}.bgin.id</h3>
          <p className="text-sm text-gray-500">
            {formatShortAddress(profile?.address || "")}
          </p>
          {profile?.text?.description && (
            <div className="pt-8">
              <p className="text-sm text-gray-500">Bio</p>
              <p>{profile?.text?.description}</p>
            </div>
          )}
          {profile?.text["com.twitter"] && (
            <div className="pt-8">
              <p className="text-sm text-gray-500">Twitter</p>
              <p>
                <a
                  className="flex items-center"
                  href={`https://x.com/${profile?.text["com.twitter"]}`}
                  target="_blank"
                >
                  <FaXTwitter style={{ paddingRight:'4px'}}/> @{profile?.text["com.twitter"]}
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
                }}
              >
                <IoCopyOutline />
              </a>
            </p>
          </div>
        </div>
        )}
      </div>

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
  );
}
