import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const Updates = ({ updates = [] }) => {
  return (
    <div className="px-2 py-4 h-full rounded-xl border bg-white shadow-2xs">
      <h2 className="pb-2 text-black/70 font-semibold text-center">
        Recent Updates
      </h2>
      <ScrollArea className="h-74">
        <div className="grid">
          {updates.map((update) => (
            <div
              key={update.id}
              className="py-2 px-1 flex items-center gap-2 hover:bg-muted cursor-pointer rounded-md "
            >
              <Avatar>
                <AvatarImage src={update.imageSrc} />
                <AvatarFallback>{update.fallbackName}</AvatarFallback>
              </Avatar>
              <p className="line-clamp-1 text-sm">{update.updateMessage}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Updates;
