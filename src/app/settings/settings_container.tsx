import { redirect } from 'next/navigation'
import { auth } from "@/auth";
import { TagStd } from "@/components/component/tag";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { EditForm } from './link_user_form';
import { Form } from './author_name_change_form';
import { api } from '@/api'

export async function SettingsContainer() {

    const user = (await auth())?.user
    const linked_author = await api.get.userauthor(user?.linked_author!)

    return <div className='flex flex-col space-y-4'>
        <h2 className="text-xl flex space-x-2">
            <span>Linked Author:</span>
            <span>
                {
                    (() => {
                        if (linked_author == null || linked_author == undefined) {
                            return <Dialog>
                                <DialogTrigger>
                                    <TagStd tag={{ 'category': 'Person', 'title': '[System] Unknown', 'id': -1 }} overrideColor="555555" />
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Link To Account Author</DialogTitle>
                                        <DialogDescription>Link this user account to an author</DialogDescription>
                                    </DialogHeader>
                                    <EditForm defaultData={linked_author} formSubmit={async (a) => { "use server"; api.modify.usersettings.add_linked_author(user?.id!, a); redirect(`/settings?${Math.random()}`) }} />
                                </DialogContent>
                            </Dialog>
                        }
                        else {
                            return <form action={async () => { "use server"; api.modify.usersettings.remove_linked_author(user?.id!); redirect(`/settings?${Math.random()}`) }}>
                                <button className="hover:line-through" type="submit">
                                    <TagStd tag={linked_author.tag} />
                                </button>
                            </form>

                        }

                    })()
                }
            </span>
        </h2>
        {
            linked_author != null && linked_author != undefined ? 
            <div>
                <div className="">
                    <Form 
                        defaultData={linked_author.preferred_name} 
                        onFormSubmit={async (res) => {
                            "use server"; 
                            api.modify.usersettings.update_linked_author(linked_author, res); 
                            redirect(`/settings?${Math.random()}`)
                        }}
                    />
                    </div>
            </div>
            : ""
        }
    </div>

}

