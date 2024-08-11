import { useQuery } from "@tanstack/react-query";
import uballet from "../../api/uballet";

function useContacts() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['contacts'],
        queryFn: async () => {
            const contacts = await uballet.getContacts()
            return contacts
        }
    })

    return {
        contacts: data,
        isLoading,
        isError
    }
}

export { useContacts }