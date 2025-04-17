import Footer from "@/components/Footer";
import ImageSlideshow from "@/components/ImageSlideshow";

export default async function Home() {

  return (
    <div className="h-full min-h-[calc(100dvh-80px)] w-full flex flex-col justify-stretch items-center">
      <div className="flex-grow items-center w-full h-1 md:my-2 py-8 px-5 text-center text-slate-600
       dark:text-slate-300 md:border-1 border-slate-300 dark:border-slate-700 bg-zig-zag flex 
       flex-col gap-7">
        <h1 className="font-bold text-xl mb-4">
          Welcome to{" "}
          <span className="text-secondary dark:text-teal-200 text-shadow">
            Chat
          </span>
          <span className="text-[#fcb160] dark:text-accent text-shadow font-extrabold">
            APP
          </span>
          !
        </h1>

        <ImageSlideshow />
      </div>
      <Footer />
    </div>
  );
}
