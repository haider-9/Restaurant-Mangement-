import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/use-notifications";
import { UserCircle2 } from "lucide-react";

const formatter = Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

const Updates = () => {
  const { notifications } = useNotifications({
    role: "user",
  });

  return (
    <div className="px-2 py-4 h-full overflow-hidden">
      <h2 className="pb-2 text-black/70 font-semibold text-center">
        Recent Updates
      </h2>
      {notifications.length === 0 && (
        <div className="h-full flex items-center justify-center text-lg text-muted-foreground">
          No Recent Notifications
        </div>
      )}
      {notifications.length > 0 && (
        <ScrollArea className="h-74 md:h-full max-h-[500px] ">
          <div className="grid gap-0.5">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="py-2 px-1 hover:bg-primary/10 border border-transparent hover:border-primary/30 cursor-pointer rounded-md mr-3 flex items-center gap-2 relative"
              >
                <UserCircle2 className="size-6" />
                <div className="grow space-y-1.5">
                  <p className="line-clamp-2 text-sm text-left">
                    {notification?.message}
                  </p>
                  <p className="text-muted-foreground text-right text-xs">
                    {formatter.format(Date.parse(notification?.createdAt))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default Updates;
