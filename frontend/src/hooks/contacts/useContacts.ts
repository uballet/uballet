import { useQuery } from "@tanstack/react-query";
import uballet from "../../api/uballet";

function useContacts() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const contacts = await uballet.getContacts();
      // Sort contacts by name
      contacts.sort((a, b) => a.name.localeCompare(b.name));
      return contacts;
    },
  });

  return {
    contacts: data,
    isLoading,
    isError,
  };
}

export { useContacts };
