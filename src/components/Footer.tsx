import ContactMe from "./ContactMe";

export default function Footer() {


  return (
    <div className="flex h-[80px] bg-gradient-to-r from-slate-700 to-teal-700 gap-0 w-full max-w-4xl mx-auto justify-center items-center text-white">
      <p>
        Got questions? <ContactMe />
      </p>
    </div>
  );
}
