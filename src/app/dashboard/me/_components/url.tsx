"use client"
import { Button } from "@/components/ui/button";
import { createUsername } from "../_actions/create-username";
import { useState } from "react";
import Link from "next/link";
import { Link2 } from "lucide-react";

interface UrlPreviewprops{
    username: string | null;
}

export function UrlPreview({ username: slug }: UrlPreviewprops){

    const [error, setError] = useState<null | string>()
    const [username, setUsername] = useState(slug)

    async function submitAction(formData: FormData) {
        const username = formData.get('username') as string

        if(username === "") {
          return;
        }

        const response = await createUsername({ username })

        if(response.error) {
            setError(response.error)
            return;
        }


        if(response.data){
            setUsername(response.data)
        }
    }

    if(!!username){
        return(
            <div className="flex items-center justify-between flex-1 p-2 text-gray-100">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-2">
                    <h3 className="font-bold text-lg">Sua URL:</h3>
                    <Link 
                        href={`${process.env.NEXT_PUBLIC_HOST_URL}creator/${username}`}
                        target="_blank"
                    >
                        {process.env.NEXT_PUBLIC_HOST_URL}creator/{username}
                    </Link>
                </div>

                <Link
                    href={`${process.env.NEXT_PUBLIC_HOST_URL}creator/${username}`}
                    target="_blank"
                    className="bg-blue-500 px-4 py-1 rounded-md hidden md:block"
                >
                    <Link2 className="w-5 h-5 text-white" />
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="flex items-center flex-1 p-2 text-gray-100">
                <form 
                className="flex flex-1 flex-col md:flex-row gap-4 items-start md:items-center"
                action={submitAction}
                >
                    <div className="flex items-center justify-center w-full">
                        <p>
                        {process.env.NEXT_PUBLIC_HOST_URL}creator/
                        </p>
                        <input 
                        type="text" 
                        className="flex-1 outline-none border h-9 border-gray-300 bg-gray-50 text-black rounded-md px-2" 
                        placeholder="Digite seu Username..."
                        name="username"
                        />
                    </div>

                    <Button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-600 h-9 w-full md:w-fit text-white px-4 rounded-md cursor-pointer mt-2">
                        Salvar
                    </Button>

                    {error && <p className="text-red-500">{error}</p>}

                </form>
            </div>
        </div>
    )
}