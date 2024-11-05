import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import uballet from "../../api/uballet";
import { Contact } from "../../api/uballet/types";

const useAddContact = () => {
  const queryClient = useQueryClient();

  const addContact = useCallback(
    async ({ name, address }: { name: string; address: string }) => {
      const contact = await uballet.addContact({ name, address });
      return contact;
    },
    []
  );

  const {
    mutate: addNewContact,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: addContact,
    onSuccess(contact) {
      queryClient.setQueryData(["contacts"], (contacts: Contact[]) =>
        [...(contacts ?? []), contact].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
    },
  });

  return {
    addNewContact,
    isPending,
    isSuccess,
  };
};

export { useAddContact };
