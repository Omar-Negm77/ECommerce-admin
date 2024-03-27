import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h2>
          Hello, <b>{session?.user?.name}</b>{" "}
        </h2>
        <div className="flex bg-gray-200 text-black gap-1 rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt="" className="w-6 h-6 " />
          <span className="px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
