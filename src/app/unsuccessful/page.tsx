"use client"
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function Page() {
    return <Suspense><InnerPage/></Suspense>
}

function InnerPage() {
    const searchParams = useSearchParams()
    const status = searchParams?.get('status')

    return <div className="w-full h-[100vh] flex flex-col items-center justify-center">
            <h1 className="text-5xl">
                Something Went Wrong
            </h1>
            <h2 className="text-xl">
                {status}
            </h2>
            <p className="text-2xl">
                {(() => {
                    let res = ""
                    switch (status) {
                        case "200": res = "OK"
                        case "400": res = "Bad Request"; break;
                        case "401": res = "Unauthorised"; break;
                        case "402": res = "Payment Required"; break;
                        case "403": res = "Forbidden"; break;
                        case "404": res = "Resource Not Found"; break;
                        case "405": res = "Method Not Allowed"; break;
                        case "406": res = "Not Acceptable"; break;
                        case "407": res = "Proxy Authentication Requred"; break;
                        case "408": res = "Request Timeout"; break;
                        case "409": res = "Conflict"; break;
                        case "410": res = "Gone"; break;
                        case "411": res = "Length Required"; break;
                        case "412": res = "Precondition Failed"; break;
                        case "413": res = "Payload Too Large"; break;
                        case "414": res = "URI Too Long"; break;
                        case "415": res = "Unsupported Media Type"; break;
                        case "416": res = "Range Not Satisfiable"; break;
                        case "417": res = "Expectation Failed"; break;
                        case "418": res = "I'm A Teapot"; break;
                        case "421": res = "Misdirected Request"; break;
                        case "422": res = "Unprocessable Content"; break;
                        case "423": res = "Locked"; break;
                        case "424": res = "Failed Dependency"; break;
                        case "425": res = "Too Early"; break;
                        case "426": res = "Upgrade Required"; break;
                        case "428": res = "Precondition Required"; break;
                        case "429": res = "Too Many Requests"; break;
                        case "431": res = "Request Header Too Large"; break;
                        case "451": res = "Unavailable For Legal Reasons"; break;
                        case "500": res = "Internal Server Error"; break;
                        case "501": res = "Not Implemented"; break;
                        case "502": res = "Bad Gateway"; break;
                        case "503": res = "Service Unavailable"; break;
                        case "504": res = "Gateway Timeout"; break;
                        case "505": res = "HTTP Version Not Supported"; break;
                        case "506": res = "Variant Also Negotiates"; break;
                        case "507": res = "Insufficient Storage"; break;
                        case "508": res = "Loop Detected"; break;
                        case "510": res = "Not Extended"; break;
                        case "511": res = "Network Authentication Required"; break                        
                        default: res = "Unknown HTTP Error"; break;
                    }
                    return res;
                })()}
            </p>
        </div>
}