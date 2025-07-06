import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatsCard = ({ heading, stat, percentage, isIncrease = true, className }) => {
  return (
    <Card className={cn("text-center text-black/70 border shadow-2xs rounded-3xl pb-1", className)}>
      <CardHeader>
        <CardTitle className="">{heading}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl sm:text-4xl font-bold">{stat}</div>
        {percentage && <div
          className={cn(
            "w-full inline-flex items-center justify-end gap-2 text-sm font-semibold",
            {
              "text-success": isIncrease,
              "text-danger": !isIncrease,
            }
          )}
        >
          {isIncrease ? (
            <TrendingUp className="size-4" />
          ) : (
            <TrendingDown className="size-4" />
          )}{" "}
          {(percentage * 100).toFixed(2)}%
        </div>}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
