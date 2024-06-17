"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BeginId } from "@beginwallet/id";
import { formatShortAddress } from "./helpers";

export default function Home() {
  const beginId = new BeginId('31cab9edcc1c530e29924a56167d4ed17d50b7fds');

  const [username, setUsername] = useState<any>();
  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    const resolve = async (name:string) => {
      const result = await beginId.resolveAddress(name);
      console.log({result})

      setProfile(result);
    }
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
            {profile?.image ? (<Image
              src={profile?.image}
              alt={`BeginID: ${profile?.name}`}
              className="rounded-full"
              width={96}
              height={96}
              priority
            />): (
              <div className="animate-pulse w-[96px] h-[96px] rounded-full bg-slate-700"></div>
            )}
          </div>
        </div>
        <div className="mt-12 p-4">
          <h3 className="text-xl text-bold">{profile?.name}.beginid.io</h3>
          <p className="text-sm text-gray-500">{formatShortAddress(profile?.address || '')}</p>
          <div className="pt-8">
            <p className="text-sm text-gray-500">Bio</p>
            <p>{profile?.text?.description}</p>
          </div>
          <div className="pt-8">
            <p className="text-sm text-gray-500">Twitter</p>
            <p>@{profile?.text['com.twitter']}</p>
          </div>
          <div className="pt-8">
            <p className="text-sm text-gray-500">Addresses</p>
            <p>{formatShortAddress(profile?.address || '')}</p>
          </div>
        </div>
      </div>

      <div className="w-full footer">
        <p className="text-center text-sm text-gray-500">BeginID - Universal Wallet Address</p>
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
