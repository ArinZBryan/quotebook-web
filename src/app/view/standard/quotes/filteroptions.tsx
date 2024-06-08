import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { FilterIcon } from "@/components/component/filter-icon";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"


const formSchema = z.object({
    direction: z.enum(["Ascending", "Descending", "None"]),
    contains: z.string()
})

export function FilterOptionsPanel({ canBeSorted = true, onDismiss = (values: z.infer<typeof formSchema>) => {} }) {
    const f = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            direction: "None",
            contains: ""
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        onDismiss(values)
    }

    return (
        <Popover>
            <PopoverTrigger><FilterIcon /></PopoverTrigger>
            <PopoverContent>
                <Form {...f}>
                    <form onSubmit={f.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                        { canBeSorted ? (<FormField
                            control={f.control}
                            name="direction"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Filter Direction</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Ascending" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Ascending
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="Descending" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Descending
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="None" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    Don't Sort
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />) : (<></>)}
                        <FormField
                            control={f.control}
                            name="contains"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contains</FormLabel>
                                    <FormControl>
                                        <Input placeholder="..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Filter Values Containing
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>

    )
}