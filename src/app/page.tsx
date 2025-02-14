import { getCurrentProfile } from "@/app/actions/profileActions";
import Footer from "@/components/Footer";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export default async function Home() {
  const currentProfile = await getCurrentProfile();

  return (
    <div className="h-full min-h-[calc(100dvh-80px)] flex flex-col justify-stretch">
      <div className="flex-grow w-full md:my-2 p-12 text-center text-slate-600 dark:text-slate-300 md:border-1 border-slate-300 dark:border-slate-500 bg-zig-zag flex flex-col gap-7 items-center">
        <h1 className="font-bold text-xl mb-2">
          Welcome to <span className="text-white wide-text-shadow">Chat</span>
          <span className="text-[#fb9f3c] dark:text-accent">APP</span>!
        </h1>

        <p>Simply sign in and start chatting with anyone you find here!</p>
        <p>
          Please note, this project was created as a coding exercise to
          demonstrate basic messaging functionality in the browser. Therefore,
          do not rely on this app for important conversations and be considerate
          when contacting people you do not personally know.
        </p>
        <p>
          Any abusive or inappropriate behavior will result in a ban. Please be
          kind and professional.
        </p>

        <div className="flex-grow flex flex-col justify-center items-center">
          <HiOutlineChatBubbleLeftRight
            size={40}
            className="text-teal-400 dark:text-teal-200"
          />
          <p className="my-3">Thank you!</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
