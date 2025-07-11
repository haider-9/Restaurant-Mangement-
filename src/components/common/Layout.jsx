import { ScrollArea } from "@/components/ui/scroll-area";

const Layout = ({ title, children }) => {
  return (
    <ScrollArea className="h-screen">
      <main className="py-6 px-4 bg-[#F9FAFB]">
        <h1 className="pb-6 text-center text-2xl font-bold text-black/70">
          {title}
        </h1>
        {children}
      </main>
    </ScrollArea>
  );
};

export default Layout;
