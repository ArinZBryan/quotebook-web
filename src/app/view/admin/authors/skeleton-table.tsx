import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTable({ cols }: { cols: number }) {

    const data = Array(cols).fill(100/cols);

    return (
        <div className="p-1">
            <div className="flex flex-row w-[100%] h-[120px] mb-1">
                {
                    data.map((item, index) => (
                        <div style={{width:`${100/cols}%`, paddingRight:index == cols -1 ? "0" : "0.25rem"}} key={index} className="box-border">
                            <Skeleton className="rounded-xl w-[100%] h-[100%]" ></Skeleton>
                        </div>
                        
                    ))
                }
            </div>
            <div className="flex flex-col space-y-1">
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
                <Skeleton className="h-12 rounded-xl pb-1 pt-1" />
            </div>
        </div>
    )
}
