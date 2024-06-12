"use client"
import { Input } from "@/components/ui/input";
import React from "react";

export function Form({ defaultData, onFormSubmit }: { defaultData : string, onFormSubmit: (formResult : string) => void }) {


    const [formData, setFormData] = React.useState<string>(defaultData)

    return (<div className="flex space-x-2 items items-center">
        <h2 className="text-xl flex-shrink-0">Linked Author Preferred Name: </h2>
        <Input defaultValue={defaultData} onInput={(e) => setFormData(e.currentTarget.value)} onKeyDown={(e) => { e.code == "Enter" ? onFormSubmit(formData) : ""}} className="flex-shrink w-60"/>
    </div>)
}