"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ScrollArea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@workout/ui";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import Loading from "~/components/loading";
import { useListPaginatedExercises } from "~/hooks";
import useProgressHistory from "~/hooks/useProgressHistory";

const chartConfig = {
  weight: {
    label: "Weight (KG)",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig;

const ProgressChart: React.FC = () => {
  const [exerciseId, setExerciseId] = useState<string>();
  const { data, isLoading } = useProgressHistory(exerciseId || "");
  const {
    data: exercises,
    isLoading: isLoadingExercises,
    fetchNextPage: fetchNextExercisePage,
    hasNextPage: hasNextExercisePage,
    isFetchingNextPage: isFetchingNextExercisePage,
  } = useListPaginatedExercises();

  useEffect(() => {
    if (hasNextExercisePage && !isFetchingNextExercisePage) {
      fetchNextExercisePage();
    }
  }, [hasNextExercisePage, isFetchingNextExercisePage, fetchNextExercisePage]);

  return (
    <div>
      {isLoadingExercises ? (
        <Loading />
      ) : (
        <div>
          <div className="flex items-center justify-start mb-4 space-x-2">
            <Select
              value={exerciseId || ""}
              onValueChange={(id) => setExerciseId(id)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Exercise" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea>
                  <SelectGroup>
                    {exercises.map((exercise) => (
                      <SelectItem key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <Button
                    className="w-full px-2"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExerciseId(undefined);
                    }}
                  >
                    Clear
                  </Button>
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Progressive Overload</CardTitle>
            <CardDescription>
              Showing your progressive overload in the exercise selected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={data?.progress}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickMargin={4} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" hideLabel />}
                />
                <YAxis dataKey="weight" tickMargin={4} />
                <Area
                  dataKey="weight"
                  type="linear"
                  fill="var(--color-weight)"
                  fillOpacity={0.4}
                  stroke="var(--color-weight)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>

          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Progressive Overload 💪🏼
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ProgressChart;
