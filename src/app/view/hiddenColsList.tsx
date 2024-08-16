import { Button } from "@/components/ui/button";

export function FloatingHiddenColsList(props : {
    list: string[],
    onItemRemoved: (item: string) => void,
    rerender?: number
}) {

    if (props.list.length == 0) return <div></div>

    return <div className="fixed bottom-[1rem] left-4 z-50">
        <div className="flex flex-col py-[0.375rem] px-[0.375rem] rounded-md items-center justify-center bg-gray-900 text-gray-50 shadow-md transition-colors hover:bg-gray-900/90 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus:ring-gray-300">
            <span className="pb-1">Hidden Columns</span>
            {props.list.map((v, i) => 
                <Button variant={"ghost"} key={i} className="hover:line-through decoration-[3.5px] w-full" onClick={() => {props.onItemRemoved(v)}}>
                    {v}
                </Button>
            )}
        </div>
        <div></div>
    </div>
}