import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 gap-16 sm:p-20 sm:pb-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 sm:items-start">
        <div className="text-center w-full">
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={240}
            height={120}
            className="dark:filter dark:invert object-center m-auto"
          />
          <h1 className="mt-4 text-3xl">Next Blog with MDX</h1>
        </div>
      </main>
    </div>
  );
}
