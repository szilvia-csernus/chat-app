import { getCurrentProfile } from "@/app/actions/profileActions";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export default async function Home() {
  const currentProfile = await getCurrentProfile();

  return (
    <div className="w-full h-full sm:mt-2 p-12 text-center text-slate-600 dark:text-slate-300 border-1 border-slate-300 dark:border-slate-500 bg-zig-zag flex flex-col gap-7 items-center">
      <h1 className="font-bold text-xl mb-2">
        Welcome to <span className="text-white wide-text-shadow">Chat</span>
        <span className="text-accent">APP</span>!
      </h1>

      <p>Simply sign in and start chatting with whomever you find here!</p>
      <p>
        Please note, this project was created as a mere coding exercise,
        intended to demonstrate basic messaging functionality in the browser.
        For this reason, please don't rely on this app for important conversations and
        be considerate when contacting people you don't personally know.
      </p>
      <p>
        Any abusive or inappropriate behavior will result in a ban so please be
        kind and professional.
      </p>
      <p className="my-3">Thank you!</p>
      <HiOutlineChatBubbleLeftRight
        size={40}
        className="text-teal-400 dark:text-teal-200"
      />
    </div>
  );
}
