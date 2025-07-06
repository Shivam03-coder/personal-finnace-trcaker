import type { FinanceCardData } from "@/types/app";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

const FinanceSummaryCard = ({ data }: { data: FinanceCardData }) => {
  return (
    <Card
      className={`@container/card shadow-primary ${data.className || ""}`}
      data-slot="card"
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          {data.icon}
          <CardDescription>{data.title}</CardDescription>
        </div>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {data.amount}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {data.statusText} {data.trendIcon}
        </div>
        <div className="text-muted-foreground">{data.secondaryText}</div>
      </CardFooter>
    </Card>
  );
};

export default FinanceSummaryCard;
